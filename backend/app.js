//contacts API

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const Database = require("better-sqlite3");
const db = new Database("contacts.db");

db.exec(`
CREATE TABLE IF NOT EXISTS contacts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
phone TEXT NOT NULL
)
`);

app.get("/contacts/", (req, res) => {
  try {
    const contact = db.prepare("SELECT * FROM contacts").all();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "somehing went wrong" });
  }
});

app.post("/contacts", (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "info is required" });
    }
    const result = db
      .prepare("INSERT INTO contacts (name, phone) VALUES (?, ?)")
      .run(name, phone);
    res.status(201).json({ id: result.lastInsertRowid, name, phone });
  } catch (error) {
    res.status(500).json({ error: "somehing went wrong" });
  }
});

app.get("/contacts/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) {
      return res.status(400).json({ error: "contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "somehing went wrong" });
  }
});

app.put("/contacts/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) {
      return res.status(404).json({ error: "contact not found" });
    }
    const { name, phone } = req.body;
    db.prepare("UPDATE contacts SET name = ?, phone = ? WHERE id = ?").run(
      name,
      phone,
      id,
    );
    res.json({ id, name, phone });
  } catch (error) {
    res.status(500).json({ error: "somehing went wrong" });
  }
});

app.delete("/contacts/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) {
      return res.status(404).json({ error: " contact not found " });
    }
    db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
    res.json({ message: "contact deleted" });
  } catch (error) {
    res.status(500).json({ error: "somehing went wrong" });
  }
});

app.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
