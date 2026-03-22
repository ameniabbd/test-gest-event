"use client";

import { useState } from "react";
import api from "../lib/api";


export default function EventCard({ event, onDelete }: any) {
  const [clients, setClients] = useState([]);
  const [showClients, setShowClients] = useState(false);

  const fetchClients = async () => {
    const res = await api.get(`/events/${event.id}/clients`);
    setClients(res.data);
    setShowClients(!showClients);
  };

  return (
    <div className="bg-white border rounded-2xl shadow p-5 space-y-3">
      
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800">
        {event.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm">
        {event.description}
      </p>

      {/* Infos */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span>📅 {event.date}</span>
        <span>📍 {event.location}</span>
        <span>👥 {event.max_participants} participants</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onDelete(event.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Supprimer
        </button>

        <button
          onClick={fetchClients}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          {showClients ? "Cacher clients" : "Voir clients"}
        </button>
      </div>

      {/* Clients */}
      {showClients && (
        <div className="pt-3 border-t mt-3">
          <h3 className="font-semibold mb-2">Clients inscrits :</h3>

          {clients.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Aucun client inscrit
            </p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {clients.map((c: any) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}