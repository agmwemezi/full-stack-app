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
    <div className="app">
      <h1>Contacts</h1>

      <div className="add-card">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              document.getElementById("phone-input").focus();
          }}
        />
        <input
          id="phone-input"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
        />
        <button className="btn-add" onClick={addContact}>
          Add Contact
        </button>
      </div>

      <div className="contacts-list">
        {contacts.map((contact, i) => (
          <div className="contact-card" key={i}>
            <div className="contact-main">
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-phone">{contact.phone}</span>
              </div>
              <div className="contact-actions">
                <button
                  className="btn-edit"
                  onClick={() => editContact(contact)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteContact(contact.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {editingContact && editingContact.id === contact.id && (
              <div className="inline-edit">
                <input
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                    })
                  }
                />
                <input
                  placeholder="Phone"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      phone: e.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                />
                <div className="edit-actions">
                  <button
                    className="btn-update"
                    onClick={() => updateContact(editingContact.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditingContact(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
