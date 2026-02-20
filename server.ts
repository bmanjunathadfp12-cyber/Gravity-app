import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("nexus.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar TEXT,
    bio TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    image TEXT,
    type TEXT DEFAULT 'social', -- social, professional, story
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT,
    category TEXT,
    rating REAL DEFAULT 4.5
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Initial Data
const seed = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    db.prepare("INSERT INTO users (username, display_name, avatar, bio) VALUES (?, ?, ?, ?)").run(
      "johndoe", "John Doe", "https://picsum.photos/seed/john/200", "Tech enthusiast & traveler"
    );
    db.prepare("INSERT INTO users (username, display_name, avatar, bio) VALUES (?, ?, ?, ?)").run(
      "janedoe", "Jane Smith", "https://picsum.photos/seed/jane/200", "Designer & Coffee Lover"
    );

    db.prepare("INSERT INTO posts (user_id, content, image, type) VALUES (?, ?, ?, ?)").run(
      1, "Just launched my new project on Nexus! #tech #launch", "https://picsum.photos/seed/project/800/600", "social"
    );
    db.prepare("INSERT INTO posts (user_id, content, image, type) VALUES (?, ?, ?, ?)").run(
      2, "Beautiful morning in the city.", "https://picsum.photos/seed/city/800/600", "social"
    );
    db.prepare("INSERT INTO posts (user_id, content, type) VALUES (?, ?, ?)").run(
      1, "Looking for a Senior React Developer to join our team! #hiring #jobs", "professional"
    );

    db.prepare("INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)").run(
      "Wireless Headphones", "High-quality noise-canceling headphones.", 199.99, "https://picsum.photos/seed/headphones/400", "Electronics"
    );
    db.prepare("INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)").run(
      "Smart Watch", "Track your fitness and stay connected.", 249.50, "https://picsum.photos/seed/watch/400", "Electronics"
    );
    db.prepare("INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)").run(
      "Leather Wallet", "Classic slim design made from genuine leather.", 45.00, "https://picsum.photos/seed/wallet/400", "Accessories"
    );
  }
};
seed();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/posts", (req, res) => {
    const type = req.query.type;
    let query = `
      SELECT posts.*, users.display_name, users.username, users.avatar 
      FROM posts 
      JOIN users ON posts.user_id = users.id
    `;
    if (type) {
      query += ` WHERE posts.type = ?`;
    }
    query += ` ORDER BY created_at DESC`;
    
    const posts = type ? db.prepare(query).all(type) : db.prepare(query).all();
    res.json(posts);
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/users/:username", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(req.params.username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/posts", (req, res) => {
    const { user_id, content, image, type } = req.body;
    const result = db.prepare("INSERT INTO posts (user_id, content, image, type) VALUES (?, ?, ?, ?)").run(
      user_id, content, image, type || 'social'
    );
    res.json({ id: result.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
