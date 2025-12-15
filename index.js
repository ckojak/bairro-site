/**
 * Sistema de Gerenciamento de Anúncios - Bairro
 * 
 * AVISO DE SEGURANÇA:
 * Este código é para DESENVOLVIMENTO/DEMONSTRAÇÃO apenas.
 * 
 * Para uso em PRODUÇÃO, implemente:
 * - Hash de senhas com bcrypt
 * - Autenticação JWT ou sessions
 * - Banco de dados real (não em memória)
 * - Validação completa de inputs
 * - Rate limiting
 * - HTTPS
 * - CORS apropriado
 * - Upload seguro de imagens
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
// NOTA: Em produção, servir apenas a pasta 'public' e não o diretório raiz
// Exemplo: app.use(express.static('public'));
app.use(express.static('.'));

// In-memory database (em produção, usar um banco de dados real)
const collaborators = [
  { 
    id: 1, 
    email: 'colaborador1@bairro.com', 
    password: 'senha123', 
    name: 'Cassio Eletro Show',
    announcementId: 1 
  },
  { 
    id: 2, 
    email: 'colaborador2@bairro.com', 
    password: 'senha123', 
    name: 'Kasinha Publounge',
    announcementId: 2 
  },
  { 
    id: 3, 
    email: 'colaborador3@bairro.com', 
    password: 'senha123', 
    name: 'Dalhe Brasa',
    announcementId: 3 
  }
];

const announcements = [
  {
    id: 1,
    name: 'Cassio Eletro Show',
    description: 'Experimente apresentações eletrizantes e energia cativante com Cassio Eletro Show!',
    image: '',
    instagram: 'https://www.instagram.com/cassioeletroshow',
    facebook: 'https://www.facebook.com/cassioeletroshow',
    whatsapp: ''
  },
  {
    id: 2,
    name: 'Kasinha Publounge',
    description: 'Junte-se a nós na Kasinha Publounge para um ambiente aconchegante, ótimas bebidas e momentos inesquecíveis.',
    image: '',
    instagram: 'https://www.instagram.com/kasinhapublounge',
    facebook: 'https://www.facebook.com/kasinhapublounge',
    whatsapp: ''
  },
  {
    id: 3,
    name: 'Dalhe Brasa',
    description: 'Saboreie o sabor de delícias grelhadas com maestria apenas no Dalhe Brasa.',
    image: '',
    instagram: 'https://www.instagram.com/dalhebrasa',
    facebook: 'https://www.facebook.com/dalhebrasa',
    whatsapp: ''
  }
];

// Login do colaborador
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  const collaborator = collaborators.find(c => c.email === email && c.password === password);
  
  if (!collaborator) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
  
  // Retorna dados do colaborador (exceto senha)
  const { password: _, ...collaboratorData } = collaborator;
  res.json({ 
    success: true, 
    collaborator: collaboratorData,
    message: 'Login realizado com sucesso' 
  });
});

// Buscar todos os anúncios
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

// Buscar anúncio específico do colaborador
app.get('/api/announcements/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const announcement = announcements.find(a => a.id === id);
  
  if (!announcement) {
    return res.status(404).json({ error: 'Anúncio não encontrado' });
  }
  
  res.json(announcement);
});

// Atualizar anúncio do colaborador
app.put('/api/announcements/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { description, image, instagram, whatsapp } = req.body;
  
  // NOTA DE SEGURANÇA: Em produção, adicionar autenticação JWT/session aqui
  // e verificar se o usuário logado tem permissão para editar este anúncio
  
  const announcementIndex = announcements.findIndex(a => a.id === id);
  
  if (announcementIndex === -1) {
    return res.status(404).json({ error: 'Anúncio não encontrado' });
  }
  
  // Validação básica de entrada
  if (description !== undefined) {
    if (typeof description !== 'string' || description.length > 500) {
      return res.status(400).json({ error: 'Descrição inválida (máx 500 caracteres)' });
    }
    announcements[announcementIndex].description = description;
  }
  
  if (image !== undefined) {
    if (typeof image !== 'string' || (image && !image.match(/^https?:\/\/.+/))) {
      return res.status(400).json({ error: 'URL de imagem inválida' });
    }
    announcements[announcementIndex].image = image;
  }
  
  if (instagram !== undefined) {
    if (typeof instagram !== 'string' || (instagram && !instagram.match(/^https?:\/\/.+/))) {
      return res.status(400).json({ error: 'URL do Instagram inválida' });
    }
    announcements[announcementIndex].instagram = instagram;
  }
  
  if (whatsapp !== undefined) {
    if (typeof whatsapp !== 'string' || (whatsapp && !whatsapp.match(/^[\d\s\(\)\-\+]+$/))) {
      return res.status(400).json({ error: 'Número de WhatsApp inválido' });
    }
    announcements[announcementIndex].whatsapp = whatsapp;
  }
  
  res.json({ 
    success: true, 
    announcement: announcements[announcementIndex],
    message: 'Anúncio atualizado com sucesso' 
  });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});