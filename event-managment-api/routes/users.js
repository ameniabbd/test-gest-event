const express = require('express');
const { pool } = require('../database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Obtenir les inscrits d'un événement
router.get('/event/:eventId/attendees', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, er.registered_at
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = $1
      ORDER BY er.registered_at DESC
    `, [req.params.eventId]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des inscrits' });
  }
});

// Obtenir les événements d'un utilisateur
router.get('/me/events', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, er.registered_at,
             (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as total_participants
      FROM events e
      JOIN event_registrations er ON e.id = er.event_id
      WHERE er.user_id = $1
      ORDER BY e.date DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
});

// Obtenir les événements créés par l'utilisateur
router.get('/me/created-events', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, 
             COUNT(er.id) as participants_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.created_by = $1
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements créés' });
  }
});

// Obtenir le profil de l'utilisateur connecté
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, first_name, last_name, role, created_at,
             (SELECT COUNT(*) FROM events WHERE created_by = $1) as events_created,
             (SELECT COUNT(*) FROM event_registrations WHERE user_id = $1) as events_attended
      FROM users
      WHERE id = $1
    `, [req.user.id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
});

module.exports = router;