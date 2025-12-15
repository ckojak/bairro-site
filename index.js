// Existing code structure for bairro-site application (assumed)
require('dotenv').config();
const express = require('express');
const path = require('path');
const { isValidInstagramUrl, extractInstagramUsername, normalizeInstagramUrl } = require('./instagramValidator');
const { fetchInstagramProfile, clearCache } = require('./instagramFetcher');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Sample structure for routes setup
// Note: Database connection assumed to be established externally

// Collaborators route with Instagram support
const collaborators = [
  {
    id: 1,
    name: 'Cassio Eletro Show',
    email: 'contact@cassioeletroshow.com',
    description: 'Experience electrifying performances and captivating energy with Cassio Eletro Show!',
    instagramUrl: 'https://www.instagram.com/cassioeletroshow',
    facebookUrl: 'https://www.facebook.com/cassioeletroshow'
  },
  {
    id: 2,
    name: 'Kasinha Publounge',
    email: 'contact@kasinhapublounge.com',
    description: 'Join us at Kasinha Publounge for a cozy ambiance, great drinks, and unforgettable moments.',
    instagramUrl: 'https://www.instagram.com/kasinhapublounge',
    facebookUrl: 'https://www.facebook.com/kasinhapublounge'
  },
  {
    id: 3,
    name: 'Dalhe Brasa',
    email: 'contact@dalhebrasa.com',
    description: 'Savor the flavor of expertly grilled delights only at Dalhe Brasa.',
    instagramUrl: 'https://www.instagram.com/dalhebrasa',
    facebookUrl: 'https://www.facebook.com/dalhebrasa'
  }
];

app.post('/admin/add-collaborator', (req, res) => {
  const { name, email, description, instagramUrl, facebookUrl } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Validate Instagram URL if provided
  if (instagramUrl && !isValidInstagramUrl(instagramUrl)) {
    return res.status(400).json({ error: 'Invalid Instagram URL format' });
  }

  // Here, you would normally add a database query to save the collaborator
  const newCollaborator = {
    id: Date.now(),
    name,
    email,
    description: description || '',
    instagramUrl: instagramUrl ? normalizeInstagramUrl(instagramUrl) : null,
    facebookUrl: facebookUrl || null
  };
  collaborators.push(newCollaborator);

  res.status(201).json({ message: 'Collaborator added successfully', collaborator: newCollaborator });
});

app.get('/collaborators', (req, res) => {
  res.json(collaborators);
});

// Update collaborator's Instagram URL
app.put('/admin/collaborator/:id/instagram', (req, res) => {
  const { id } = req.params;
  const { instagramUrl } = req.body;

  if (!instagramUrl) {
    return res.status(400).json({ error: 'Instagram URL is required' });
  }

  // Validate Instagram URL
  if (!isValidInstagramUrl(instagramUrl)) {
    return res.status(400).json({ error: 'Invalid Instagram URL format. Please use format: https://www.instagram.com/username' });
  }

  const collaborator = collaborators.find(c => c.id === parseInt(id));
  if (!collaborator) {
    return res.status(404).json({ error: 'Collaborator not found' });
  }

  // Update Instagram URL
  const normalizedUrl = normalizeInstagramUrl(instagramUrl);
  collaborator.instagramUrl = normalizedUrl;

  // Clear cache for this username to fetch fresh data
  const username = extractInstagramUsername(normalizedUrl);
  if (username) {
    clearCache(username);
  }

  res.json({ message: 'Instagram URL updated successfully', collaborator });
});

// Get Instagram images for a collaborator
app.get('/api/instagram/:id', async (req, res) => {
  const { id } = req.params;
  const forceRefresh = req.query.refresh === 'true';

  const collaborator = collaborators.find(c => c.id === parseInt(id));
  if (!collaborator) {
    return res.status(404).json({ error: 'Collaborator not found' });
  }

  if (!collaborator.instagramUrl) {
    return res.status(404).json({ error: 'No Instagram URL configured for this collaborator' });
  }

  const username = extractInstagramUsername(collaborator.instagramUrl);
  if (!username) {
    return res.status(400).json({ error: 'Invalid Instagram URL' });
  }

  try {
    // Clear cache if force refresh is requested
    if (forceRefresh) {
      clearCache(username);
    }

    const instagramData = await fetchInstagramProfile(username);

    // Privacy check: Only return data if profile is public
    if (instagramData.isPublic === false) {
      return res.status(403).json({
        error: 'This Instagram profile is private',
        username: username
      });
    }

    res.json({
      collaborator: {
        id: collaborator.id,
        name: collaborator.name
      },
      instagram: instagramData
    });
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram data' });
  }
});

// Endpoint to validate Instagram URL
app.post('/api/validate-instagram', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const isValid = isValidInstagramUrl(url);
  const username = extractInstagramUsername(url);

  res.json({
    valid: isValid,
    username: username,
    normalizedUrl: username ? normalizeInstagramUrl(url) : null
  });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`View the site at http://localhost:${PORT}`);
});