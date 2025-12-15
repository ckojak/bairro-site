const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
  secret: 'bairro-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Helper functions to read/write data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { users: [], ads: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

function isAdmin(req, res, next) {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

// Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const data = readData();
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.role = user.role;
  req.session.collaboratorNumber = user.collaboratorNumber;

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      collaboratorNumber: user.collaboratorNumber
    }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get current user
app.get('/api/auth/me', isAuthenticated, (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === req.session.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    collaboratorNumber: user.collaboratorNumber
  });
});

// Get all ads (public)
app.get('/api/ads', (req, res) => {
  const data = readData();
  res.json(data.ads);
});

// Get ads by category (public)
app.get('/api/ads/category/:category', (req, res) => {
  const data = readData();
  const categoryAds = data.ads.filter(ad => ad.category === req.params.category);
  res.json(categoryAds);
});

// Get user's own ads
app.get('/api/ads/my', isAuthenticated, (req, res) => {
  const data = readData();
  const userAds = data.ads.filter(ad => ad.userId === req.session.userId);
  res.json(userAds);
});

// Create new ad
app.post('/api/ads', isAuthenticated, (req, res) => {
  const { category, title, description, image, whatsapp, instagram } = req.body;

  if (!category || !title || !description) {
    return res.status(400).json({ error: 'Category, title, and description are required' });
  }

  const data = readData();
  const newAd = {
    id: data.ads.length > 0 ? Math.max(...data.ads.map(a => a.id)) + 1 : 1,
    userId: req.session.userId,
    category,
    title,
    description,
    image: image || 'https://via.placeholder.com/400x300?text=No+Image',
    whatsapp: whatsapp || '',
    instagram: instagram || '',
    createdAt: new Date().toISOString()
  };

  data.ads.push(newAd);
  writeData(data);

  res.status(201).json(newAd);
});

// Update ad
app.put('/api/ads/:id', isAuthenticated, (req, res) => {
  const adId = parseInt(req.params.id);
  const { category, title, description, image, whatsapp, instagram } = req.body;

  const data = readData();
  const adIndex = data.ads.findIndex(ad => ad.id === adId);

  if (adIndex === -1) {
    return res.status(404).json({ error: 'Ad not found' });
  }

  const ad = data.ads[adIndex];

  // Check if user owns this ad or is admin
  if (ad.userId !== req.session.userId && req.session.role !== 'admin') {
    return res.status(403).json({ error: 'You can only edit your own ads' });
  }

  // Update ad fields
  if (category) ad.category = category;
  if (title) ad.title = title;
  if (description) ad.description = description;
  if (image !== undefined) ad.image = image;
  if (whatsapp !== undefined) ad.whatsapp = whatsapp;
  if (instagram !== undefined) ad.instagram = instagram;

  data.ads[adIndex] = ad;
  writeData(data);

  res.json(ad);
});

// Delete ad
app.delete('/api/ads/:id', isAuthenticated, (req, res) => {
  const adId = parseInt(req.params.id);

  const data = readData();
  const adIndex = data.ads.findIndex(ad => ad.id === adId);

  if (adIndex === -1) {
    return res.status(404).json({ error: 'Ad not found' });
  }

  const ad = data.ads[adIndex];

  // Check if user owns this ad or is admin
  if (ad.userId !== req.session.userId && req.session.role !== 'admin') {
    return res.status(403).json({ error: 'You can only delete your own ads' });
  }

  data.ads.splice(adIndex, 1);
  writeData(data);

  res.json({ success: true, message: 'Ad deleted successfully' });
});

// Admin: Get all collaborators
app.get('/api/admin/collaborators', isAuthenticated, isAdmin, (req, res) => {
  const data = readData();
  const collaborators = data.users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    collaboratorNumber: u.collaboratorNumber
  }));
  res.json(collaborators);
});

// Admin: Create collaborator
app.post('/api/admin/collaborators', isAuthenticated, isAdmin, async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Username, password, and name are required' });
  }

  const data = readData();

  // Check if username already exists
  if (data.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const nextId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
  const collaboratorNumber = `COLLAB-${String(nextId).padStart(3, '0')}`;

  const newUser = {
    id: nextId,
    username,
    password: hashedPassword,
    role: 'collaborator',
    name,
    collaboratorNumber
  };

  data.users.push(newUser);
  writeData(data);

  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    role: newUser.role,
    collaboratorNumber: newUser.collaboratorNumber
  });
});

// Admin: Update collaborator
app.put('/api/admin/collaborators/:id', isAuthenticated, isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password, name } = req.body;

  const data = readData();
  const userIndex = data.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Collaborator not found' });
  }

  const user = data.users[userIndex];

  // Don't allow changing admin username
  if (user.role === 'admin' && username && username !== user.username) {
    return res.status(400).json({ error: 'Cannot change admin username' });
  }

  if (username) user.username = username;
  if (name) user.name = name;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  data.users[userIndex] = user;
  writeData(data);

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    collaboratorNumber: user.collaboratorNumber
  });
});

// Admin: Delete collaborator
app.delete('/api/admin/collaborators/:id', isAuthenticated, isAdmin, (req, res) => {
  const userId = parseInt(req.params.id);

  const data = readData();
  const userIndex = data.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Collaborator not found' });
  }

  const user = data.users[userIndex];

  // Don't allow deleting admin
  if (user.role === 'admin') {
    return res.status(400).json({ error: 'Cannot delete admin user' });
  }

  // Delete user's ads as well
  data.ads = data.ads.filter(ad => ad.userId !== userId);
  data.users.splice(userIndex, 1);
  writeData(data);

  res.json({ success: true, message: 'Collaborator deleted successfully' });
});

// Admin: Get all ads (including user info)
app.get('/api/admin/ads', isAuthenticated, isAdmin, (req, res) => {
  const data = readData();
  const adsWithUsers = data.ads.map(ad => {
    const user = data.users.find(u => u.id === ad.userId);
    return {
      ...ad,
      userName: user ? user.name : 'Unknown',
      collaboratorNumber: user ? user.collaboratorNumber : 'N/A'
    };
  });
  res.json(adsWithUsers);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Default admin credentials: username=admin, password=admin123');
});
