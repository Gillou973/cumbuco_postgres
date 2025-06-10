const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const JWT_SECRET = process.env.JWT_SECRET || 'ultrasecret';

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom, prenom, adresse, email, telephone, date_creation FROM users ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID (protected)
exports.getUserById = async (req, res) => {
  const id = req.params.id;
  if (!UUID_REGEX.test(id)) return res.status(400).json({ error: "Invalid user ID (UUID required)." });

  try {
    const result = await pool.query(
      'SELECT id, nom, prenom, adresse, email, telephone, date_creation FROM users WHERE id = $1', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found." });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register
exports.register = async (req, res) => {
  const { nom, prenom, adresse, email, telephone, password } = req.body;
  if (!nom || !prenom || !adresse || !email || !telephone || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (nom, prenom, adresse, email, telephone, password, date_creation)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [nom, prenom, adresse, email, telephone, hashedPassword, new Date()]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET profil connecté
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, nom, prenom, adresse, email, telephone, date_creation FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found." });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
