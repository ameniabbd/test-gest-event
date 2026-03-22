const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();


// Obtenir tous les événements avec la liste complète des participants
// Obtenir tous les événements
router.get('/', async (req, res) => {
  try {
    // D'abord, récupérer les événements de base
    const eventsResult = await pool.query(`
      SELECT e.*, 
             u.first_name as organizer_first_name,
             u.last_name as organizer_last_name,
             u.email as organizer_email
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.date DESC
    `);
    
    const events = eventsResult.rows;
    
    // Pour chaque événement, récupérer ses participants
    for (let event of events) {
      const participantsResult = await pool.query(`
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          er.registered_at
        FROM event_registrations er
        INNER JOIN users u ON er.user_id = u.id
        WHERE er.event_id = $1
        ORDER BY er.registered_at DESC
      `, [event.id]);
      
      event.participants = participantsResult.rows;
      event.participants_count = participantsResult.rows.length;
    }
    
    res.json(events);
  } catch (error) {
    console.error('Erreur GET /events:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des événements',
      error: error.message 
    });
  }
});

// Obtenir un événement spécifique avec tous les participants
// Obtenir un événement spécifique avec débogage
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    
    const { id } = req.params;
    
    // Vérifier d'abord si l'événement existe
    const eventExists = await pool.query(
      'SELECT id FROM events WHERE id = $1',
      [id]
    );
    
    console.log('Event exists check:', eventExists.rows);
    
    if (eventExists.rows.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    // Récupérer l'événement complet
    const eventResult = await pool.query(`
      SELECT e.*, 
             u.first_name as organizer_first_name,
             u.last_name as organizer_last_name,
             u.email as organizer_email
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
    `, [id]);
    
    console.log('Event result:', eventResult.rows[0]);
    
    const event = eventResult.rows[0];
    
    // Récupérer les participants
    const participantsResult = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        er.registered_at
      FROM event_registrations er
      INNER JOIN users u ON er.user_id = u.id
      WHERE er.event_id = $1
    `, [id]);
    
    console.log('Participants found:', participantsResult.rows.length);
    
    event.participants = participantsResult.rows;
    event.participants_count = participantsResult.rows.length;
    
    res.json(event);
  } catch (error) {
    console.error('Détail de l\'erreur:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'événement',
      error: error.message,
      details: error.code ? `Code SQL: ${error.code}` : undefined
    });
  }
});


// Créer un événement (client ou admin)
router.post('/', authenticateToken, [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('date').isDate(),
  body('location').optional().trim(),
  body('max_participants').optional().isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, location, max_participants } = req.body;
  const created_by = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, date, location, max_participants, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, date, location, max_participants, created_by]
    );

    res.status(201).json({
      message: 'Événement créé avec succès',
      event: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
  }
});

// Modifier son événement
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, date, location, max_participants } = req.body;

  try {
    // Vérifier si l'utilisateur est le créateur OU admin
    const eventCheck = await pool.query(
      'SELECT created_by FROM events WHERE id = $1',
      [req.params.id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    // Seul le créateur ou un admin peut modifier
    if (eventCheck.rows[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cet événement' 
      });
    }

    const result = await pool.query(
      `UPDATE events 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           date = COALESCE($3, date),
           location = COALESCE($4, location),
           max_participants = COALESCE($5, max_participants)
       WHERE id = $6
       RETURNING *`,
      [title, description, date, location, max_participants, req.params.id]
    );

    res.json({
      message: 'Événement modifié avec succès',
      event: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
});

// Supprimer un événement
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Vérifier si l'utilisateur est le créateur OU admin
    const eventCheck = await pool.query(
      'SELECT created_by FROM events WHERE id = $1',
      [req.params.id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    // Seul le créateur ou un admin peut supprimer
    if (eventCheck.rows[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer cet événement' 
      });
    }

    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);

    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// S'inscrire à un événement avec plus de détails

router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Vérifier si l'événement existe
    const eventCheck = await pool.query(
      'SELECT id, max_participants FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    const event = eventCheck.rows[0];

    // Vérifier si l'utilisateur est déjà inscrit
    const registrationCheck = await pool.query(
      'SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (registrationCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit à cet événement' });
    }

    // Vérifier le nombre maximum de participants
    if (event.max_participants) {
      const participantsCount = await pool.query(
        'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1',
        [eventId]
      );

      if (parseInt(participantsCount.rows[0].count) >= event.max_participants) {
        return res.status(400).json({ 
          message: `L'événement a atteint son nombre maximum de participants (${event.max_participants})` 
        });
      }
    }

    // Inscrire l'utilisateur
    const result = await pool.query(
      `INSERT INTO event_registrations (event_id, user_id, registered_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING id, registered_at`,
      [eventId, userId]
    );

    // Récupérer les informations complètes de l'utilisateur
    const userInfo = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [userId]
    );

    res.status(201).json({ 
      success: true,
      message: 'Inscription à l\'événement réussie',
      registration: {
        id: result.rows[0].id,
        event_id: eventId,
        user_id: userId,
        registered_at: result.rows[0].registered_at
      },
      participant: userInfo.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message 
    });
  }
});

// Se désinscrire d'un événement
router.delete('/:id/register', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vous n\'êtes pas inscrit à cet événement' });
    }

    res.json({ message: 'Désinscription réussie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la désinscription' });
  }
});
// Obtenir tous les participants d'un événement avec leurs détails complets
router.get('/:id/participants', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.created_at as user_created_at,
        er.registered_at,
        er.status
      FROM event_registrations er
      INNER JOIN users u ON er.user_id = u.id
      WHERE er.event_id = $1
      ORDER BY er.registered_at DESC
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.json({ 
        message: 'Aucun participant pour cet événement',
        participants: [] 
      });
    }

    res.json({
      participants_count: result.rows.length,
      participants: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des participants' });
  }
});

module.exports = router;