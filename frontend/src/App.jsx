import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });

  const fetchContacts = async () => {
    const res = await fetch("http://localhost:3000/contacts", {
      cache: "no-store",
    });
    const text = await res.text();
    const data = JSON.parse(text);
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const addContact = async () => {
    await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    setName("");
    setPhone("");
    fetchContacts();
  };

  const deleteContact = async (id) => {
    console.log("deleting id:", id);
    await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "DELETE",
    });
    fetchContacts();
  };

  const editContact = (contact) => {
    setEditingContact(contact);
    setEditForm({ name: contact.name, phone: contact.phone });
  };

  const updateContact = async (id) => {
    await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingContact(null);
    fetchContacts();
  };

  return (
    <div>
      <h1>Contacts</h1>

      <div className="add-section">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn-add" onClick={addContact}>
          ADD
        </button>
      </div>

      <ul>
        {contacts.map((contact, i) => (
          <li key={i}>
            <span className="contact-info">
              {contact.name} - {contact.phone}
            </span>
            <div className="contact-actions">
              <button
                className="btn-edit"
                onClick={() => editContact(contact.id)}
              >
                EDIT
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteContact(contact.id)}
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editingContact && (
        <div className="edit-section">
          <input
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({ ...editForm, phone: e.target.value })
            }
          />
          <button
            className="btn-update"
            onClick={() => updateContact(editingContact.id)}
          >
            UPDATE
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
