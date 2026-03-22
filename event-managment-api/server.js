const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./database');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); 
// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de gestion d\'événements avec rôles',
    version: '2.0',
    roles: {
      client: 'Accès aux fonctionnalités de base',
      admin: 'Accès complet au backoffice'
    },
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      client: {
        events: 'GET /api/events',
        createEvent: 'POST /api/events (auth)',
        myEvents: 'GET /api/users/me/events (auth)',
        myProfile: 'GET /api/users/me/profile (auth)'
      },
      admin: {
        users: 'GET /api/admin/users',
        updateUserRole: 'PATCH /api/admin/users/:id/role',
        deleteUser: 'DELETE /api/admin/users/:id',
        dashboard: 'GET /api/admin/dashboard/stats',
        allEvents: 'GET /api/admin/events'
      }
    }
  });
});

// Initialisation de la base de données et démarrage du serveur
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`👥 Rôles disponibles: client, admin`);
    console.log(`🔑 Admin par défaut: admin@example.com / admin123`);
  });
}).catch(error => {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
});