import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { initialAppData } from './src/defaultData.ts';
import { AppData } from './src/types.ts';

const app = express();
const PORT = 3000;

// Body parser with 15MB limit for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Directories for persistent data and uploads
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve public uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Load or initialize DB
function loadData(): AppData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Merge with defaults in case of missing keys
      return {
        profile: { ...initialAppData.profile, ...(parsed.profile || {}) },
        carousel_items: Array.isArray(parsed.carousel_items) ? parsed.carousel_items : initialAppData.carousel_items,
        products: Array.isArray(parsed.products) ? parsed.products : initialAppData.products,
        bio_links: Array.isArray(parsed.bio_links) ? parsed.bio_links : initialAppData.bio_links,
        appearance: { ...initialAppData.appearance, ...(parsed.appearance || {}) },
        business: { ...initialAppData.business, ...(parsed.business || {}) },
      };
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to defaults:', err);
  }
  saveData(initialAppData);
  return initialAppData;
}

function saveData(data: AppData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data to db.json:', err);
  }
}

// Password hashing helper
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, actualSalt, 64);
  return { hash: derivedKey.toString('hex'), salt: actualSalt };
}

function verifyPassword(password: string, savedHash: string, savedSalt: string): boolean {
  const derived = crypto.scryptSync(password, savedSalt, 64);
  return crypto.timingSafeEqual(Buffer.from(derived.toString('hex'), 'hex'), Buffer.from(savedHash, 'hex'));
}

// Load or initialize Auth Config
function getAuthConfig(): { hash: string; salt: string } {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      // fallback
    }
  }
  const defaultPassword = process.env.ADMIN_PASSWORD || 'NemLanches@2025';
  const hashed = hashPassword(defaultPassword);
  fs.writeFileSync(AUTH_FILE, JSON.stringify(hashed, null, 2), 'utf-8');
  return hashed;
}

function updatePassword(newPassword: string) {
  const hashed = hashPassword(newPassword);
  fs.writeFileSync(AUTH_FILE, JSON.stringify(hashed, null, 2), 'utf-8');
}

// In-memory active tokens with expiration (24 hours)
interface Session {
  token: string;
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, Session>();

function createSession(): Session {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: Session = {
    token,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };
  activeSessions.set(token, session);
  return session;
}

function validateToken(token?: string): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

// Auth Middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login novamente.' });
  }
  next();
}

// --- API ROUTES ---

// 1. Public App Data
app.get('/api/data', (_req, res) => {
  const data = loadData();
  res.json({ success: true, data });
});

// 2. Admin Save App Data (Protected)
app.post('/api/data', requireAuth, (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Dados inválidos fornecidos.' });
    }
    saveData(incoming);
    res.json({ success: true, message: 'Alterações salvas com sucesso.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Falha ao salvar dados: ' + err.message });
  }
});

// 3. Reset Data (Protected)
app.post('/api/data/reset', requireAuth, (_req, res) => {
  try {
    saveData(initialAppData);
    res.json({ success: true, data: initialAppData, message: 'Dados restaurados para a configuração original.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Falha ao restaurar dados: ' + err.message });
  }
});

// 4. Admin Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Senha é obrigatória.' });
  }

  const authConfig = getAuthConfig();
  const isValid = verifyPassword(password, authConfig.hash, authConfig.salt);

  if (!isValid) {
    return res.status(401).json({ error: 'Senha incorreta. Verifique suas credenciais.' });
  }

  const session = createSession();
  res.json({
    success: true,
    token: session.token,
    expiresAt: session.expiresAt,
    message: 'Login realizado com sucesso.',
  });
});

// 5. Admin Auth: Check Token
app.get('/api/auth/check', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const valid = validateToken(token);
  res.json({ valid });
});

// 6. Admin Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// 7. Admin Auth: Change Password (Protected)
app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Preencha a senha atual e a nova senha.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
  }

  const authConfig = getAuthConfig();
  const isValid = verifyPassword(currentPassword, authConfig.hash, authConfig.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Senha atual incorreta.' });
  }

  updatePassword(newPassword);
  res.json({ success: true, message: 'Senha alterada com sucesso.' });
});

// 8. Image Upload (Protected)
app.post('/api/upload', requireAuth, (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    // Match data:[<mediatype>];base64,<data>
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Formato de imagem base64 inválido.' });
    }

    const mimeType = matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');

    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';

    const safeName = (filename ? path.parse(filename).name.replace(/[^a-z0-9_-]/gi, '_') : 'image') + '_' + Date.now() + '.' + ext;
    const targetPath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(targetPath, dataBuffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao fazer upload da imagem: ' + err.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite Middleware for SPA and Dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEM LANCHES server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
