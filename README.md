# Bairro - Sistema de Anúncios Classificados

Sistema completo de anúncios classificados com gerenciamento de colaboradores e controle de acesso.

## Características

### 1. Página Pública de Anúncios
- Exibição dinâmica de anúncios organizados por categorias
- Categorias: Bebidas, Lanchonetes, Eletrodomésticos, Shows e Eventos, e outras
- Cada anúncio inclui imagem, título, descrição e links para contato (WhatsApp/Instagram)
- Design responsivo e moderno

### 2. Sistema de Login para Colaboradores
- Autenticação segura com sessões
- Senhas criptografadas com bcrypt
- Cada colaborador tem credenciais únicas

### 3. Dashboard do Colaborador
- Colaboradores podem ver apenas seus próprios anúncios
- Funcionalidades CRUD completas (Criar, Ler, Atualizar, Excluir)
- Cada colaborador possui um número único de identificação
- Interface intuitiva para gerenciar anúncios

### 4. Dashboard do Administrador
- Acesso completo a todos os colaboradores e anúncios
- Criar, editar e excluir colaboradores
- Editar e excluir qualquer anúncio
- Visualizar números de identificação de todos os colaboradores
- Estatísticas em tempo real

### 5. Controle de Acesso e Segurança
- Colaboradores não podem modificar anúncios de outros colaboradores
- Apenas administradores têm permissões completas
- Sessões seguras com tempo de expiração
- Validação de dados em todas as operações

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Configure variáveis de ambiente:
```bash
cp .env.example .env
# Edit .env and set SESSION_SECRET to a strong random value
```

4. Inicie o servidor:
```bash
npm start
```

5. Acesse no navegador:
```
http://localhost:3000/public.html
```

## Credenciais Padrão

**Administrador:**
- Usuário: `admin`
- Senha: `admin123`

## Estrutura de Arquivos

- `server.js` - Servidor Express com todas as APIs
- `data.json` - Armazenamento de dados (usuários e anúncios)
- `public.html` - Página pública com todos os anúncios
- `login.html` - Página de login para colaboradores e admin
- `dashboard.html` - Dashboard do colaborador
- `admin.html` - Dashboard administrativo

## APIs Disponíveis

### Autenticação
- `POST /api/login` - Login de usuários
- `POST /api/logout` - Logout
- `GET /api/auth/me` - Obter usuário atual

### Anúncios (Público)
- `GET /api/ads` - Listar todos os anúncios
- `GET /api/ads/category/:category` - Anúncios por categoria

### Anúncios (Autenticado)
- `GET /api/ads/my` - Anúncios do usuário logado
- `POST /api/ads` - Criar novo anúncio
- `PUT /api/ads/:id` - Atualizar anúncio
- `DELETE /api/ads/:id` - Excluir anúncio

### Administração (Admin apenas)
- `GET /api/admin/collaborators` - Listar colaboradores
- `POST /api/admin/collaborators` - Criar colaborador
- `PUT /api/admin/collaborators/:id` - Atualizar colaborador
- `DELETE /api/admin/collaborators/:id` - Excluir colaborador
- `GET /api/admin/ads` - Listar todos os anúncios com informações do usuário

## Tecnologias Utilizadas

- **Backend:** Node.js, Express
- **Autenticação:** express-session, bcryptjs
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Armazenamento:** JSON file-based storage
- **Fontes:** Google Fonts (Playfair Display, Poppins)

## Design

O sistema utiliza um design moderno e luxuoso com:
- Paleta de cores: #1a1a2e (primário), #16213e (secundário), #e94560 (destaque), #d4af37 (dourado)
- Tipografia: Playfair Display para títulos, Poppins para textos
- Layout totalmente responsivo
- Animações e transições suaves

## Segurança

- Senhas criptografadas com bcrypt (10 rounds)
- Sessões com cookie seguro
- Validação de entrada em todas as APIs
- Controle de acesso baseado em roles (admin/collaborator)
- Proteção contra acesso não autorizado

### Considerações de Produção

**IMPORTANTE:** Para uso em produção, implemente as seguintes melhorias de segurança:

1. **Use HTTPS**: Configure SSL/TLS para criptografar toda a comunicação
2. **Variáveis de Ambiente**: Configure `SESSION_SECRET` com valor forte e aleatório
3. **Banco de Dados**: Substitua o armazenamento em arquivo JSON por um banco de dados apropriado (MongoDB, PostgreSQL, etc.)
4. **Rate Limiting**: Implemente limitação de taxa para endpoints de autenticação
5. **CORS**: Configure CORS adequadamente se o frontend for hospedado separadamente
6. **Backup**: Implemente backups regulares dos dados
7. **Logs**: Configure sistema de logs para auditoria e monitoramento

## Suporte

Para questões ou suporte, entre em contato através do repositório GitHub.
