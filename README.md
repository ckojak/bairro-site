# Sistema de Gerenciamento de Anúncios - Bairro

Sistema completo para colaboradores gerenciarem seus próprios anúncios no site Bairro.

## Funcionalidades

### Para Colaboradores
- **Login seguro** com email e senha
- **Painel de controle personalizado** para editar apenas o próprio anúncio
- **Gerenciamento de conteúdo**:
  - Editar descrição do anúncio
  - Adicionar/alterar imagem do estabelecimento
  - Atualizar link do Instagram
  - Adicionar número de WhatsApp para contato
- **Sistema de numeração**: Cada colaborador tem acesso apenas ao seu anúncio (1:1)

### Para Visitantes
- Visualização de todos os anúncios
- Links para redes sociais (Facebook, Instagram)
- Botão de WhatsApp (quando disponível)
- Design hi-tech moderno e responsivo

## Estrutura de Colaboradores

| ID | Anúncio | Email | Senha (teste) |
|----|---------|-------|---------------|
| 1 | Cassio Eletro Show | colaborador1@bairro.com | senha123 |
| 2 | Kasinha Publounge | colaborador2@bairro.com | senha123 |
| 3 | Dalhe Brasa | colaborador3@bairro.com | senha123 |

## Como Usar

### Iniciar o Servidor

```bash
# Instalar dependências (se necessário)
npm install express

# Iniciar o servidor
node index.js
```

O servidor estará rodando em `http://localhost:3000`

### Acessar como Colaborador

1. Acesse a página principal: `http://localhost:3000`
2. Role até a seção "Login Colaborador"
3. Use um dos emails de teste (ex: colaborador1@bairro.com)
4. Senha: senha123
5. Clique em "Entrar"
6. Você será redirecionado para o painel de controle

### Gerenciar seu Anúncio

No painel de controle você pode:
- **Descrição**: Escrever ou modificar a descrição do seu estabelecimento
- **Imagem**: Adicionar URL de uma imagem (ex: logo, foto do local)
- **Instagram**: Atualizar o link do perfil do Instagram
- **WhatsApp**: Adicionar número para contato direto

Clique em "Salvar Alterações" para aplicar as mudanças.

## Arquitetura

### Backend (index.js)
- **Express.js** para servidor HTTP
- **API REST** para gerenciamento de anúncios
- **Autenticação simples** com email/senha
- **Banco de dados em memória** (usar banco real em produção)

### Frontend
- **index.html**: Página principal com anúncios e login
- **painel.html**: Painel de controle do colaborador
- **Design hi-tech**: Gradientes, glassmorphism, animações

### Endpoints da API

```
POST /admin/login
- Corpo: { email, password }
- Retorna: { success, collaborator }

GET /api/announcements
- Retorna: Lista de todos os anúncios

GET /api/announcements/:id
- Retorna: Anúncio específico

PUT /api/announcements/:id
- Corpo: { description, image, instagram, whatsapp }
- Retorna: { success, announcement }
```

## Segurança

⚠️ **IMPORTANTE**: Este é um exemplo para desenvolvimento/teste.

Para uso em produção, implemente:
- Autenticação JWT ou sessions
- Hash de senhas (bcrypt)
- Banco de dados real (PostgreSQL, MongoDB, etc.)
- Validação de inputs
- Rate limiting
- HTTPS
- CORS configurado corretamente
- Upload seguro de imagens (ao invés de URLs)

## Design System

### Cores
- Primary Black: `#0a0a0a`
- Secondary Black: `#1a1a1a`
- Gold: `#d4af37`
- Cyber Blue: `#00d4ff`
- Cyber Purple: `#a855f7`

### Fontes
- **Headings**: Poppins (600, 700, 800)
- **Body**: Inter (300, 400, 500, 600)

### Efeitos
- Glassmorphism com backdrop-filter
- Gradientes animados
- Bordas com gradiente em hover
- Transições suaves

## Próximos Passos

Para melhorar o sistema:
1. Implementar banco de dados real
2. Sistema de upload de imagens
3. Validação de formulários no backend
4. Recuperação de senha
5. Sistema de aprovação de alterações
6. Analytics e estatísticas
7. Notificações por email
8. Suporte a múltiplas imagens
9. Editor WYSIWYG para descrições
10. Preview em tempo real das alterações

## Suporte

Para dúvidas ou problemas, entre em contato através do GitHub Issues.
