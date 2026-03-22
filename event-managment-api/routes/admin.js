const express = require('express');
const { pool } = require('../database');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const bcrypt = require('bcrypt');

const router = express.Router();

// Toutes les routes admin nécessitent authentification ET rôle admin
router.use(authenticateToken);
router.use(authorize('admin'));


// Lister tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, first_name, last_name, role, created_at,
             (SELECT COUNT(*) FROM events WHERE created_by = users.id) as events_created,
             (SELECT COUNT(*) FROM event_registrations WHERE user_id = users.id) as events_registered
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Créer un utilisateur (admin)
router.post('/users', async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email, hashedPassword, first_name, last_name, role || 'client']
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Modifier le rôle d'un utilisateur
router.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['client', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide. Utilisez "client" ou "admin"' });
  }

  try {
    // Empêcher l'admin de se modifier lui-même (optionnel)
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre rôle' });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Rôle modifié avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification du rôle' });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Empêcher l'admin de se supprimer lui-même
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Utilisateur supprimé avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});



router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'client') as total_clients,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM events) as total_events,
        (SELECT COUNT(*) FROM event_registrations) as total_registrations,
        (SELECT COUNT(*) FROM events WHERE date >= CURRENT_DATE) as upcoming_events,
        (SELECT json_agg(row_to_json(t)) FROM (
          SELECT date, COUNT(*) as events_count
          FROM events 
          GROUP BY date 
          ORDER BY date DESC 
          LIMIT 10
        ) t) as events_by_date
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});



// Voir tous les événements (même ceux des autres)
router.get('/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, 
             u.first_name as organizer_first_name,
             u.last_name as organizer_last_name,
             u.email as organizer_email,
             COUNT(er.id) as participants_count,
             json_agg(json_build_object(
               'user_id', u2.id,
               'user_email', u2.email,
               'user_name', u2.first_name || ' ' || u2.last_name,
               'registered_at', er.registered_at
             )) FILTER (WHERE er.id IS NOT NULL) as participants
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      LEFT JOIN users u2 ON er.user_id = u2.id
      GROUP BY e.id, u.id
      ORDER BY e.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
});

// Supprimer n'importe quel événement
router.delete('/events/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING id, title',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.json({
      message: 'Événement supprimé avec succès',
      event: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

module.exports = router;