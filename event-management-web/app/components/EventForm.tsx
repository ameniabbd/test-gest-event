"use client";

import { useState } from "react";
import api from "../lib/api";

export default function EventForm({ onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    max_participants: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ✅ validation
    if (!form.title || !form.date || !form.location) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/events", {
        title: form.title,
        description: form.description,
        date: form.date,
        location: form.location,
        max_participants: Number(form.max_participants),
      });

      console.log("✅ Event créé :", response.data);
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        max_participants: "",
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (error: any) {
  console.log('error',error?.message)
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow space-y-4 max-w-md w-full">

      <h2 className="font-bold text-lg">➕ Ajouter Event</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="title"
          value={form.title}
          placeholder="Titre"
          className="border p-2 rounded w-full text-gray-600 "
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          className="border p-2 rounded w-full text-gray-600 "
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          className="border p-2 rounded w-full text-gray-600 "
          onChange={handleChange}
        />

        <input
          name="location"
          value={form.location}
          placeholder="Lieu"
          className="border p-2 rounded w-full text-gray-600 "
          onChange={handleChange}
        />

        <input
          type="number"
          name="max_participants"
          value={form.max_participants}
          placeholder="Max participants"
          className="border p-2 rounded w-full text-gray-600 "
          onChange={handleChange}
        />

        <div className="flex gap-2 pt-2">

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>

        </div>

      </form>
    </div>
  );
}