"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import EventTable from "../../components/EventTable";
import EventForm from "../../components/EventForm";
import ClientsModal from "../../components/ClientModal";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [clients, setClients] = useState([]);
const { logout, user } = useAuth();
const router = useRouter();
  const fetchEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (data: any) => {
    await api.post("events", data);
    setShowForm(false);
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  const viewClients = async (event: any) => {
    setSelectedEvent(event);
    const res = await api.get(`/events/${event.id}`);
    setClients(res.data.participants);
  };
const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
           Gestion des évènements
        </h1>
        <div >
<button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
            Ajouter
        </button>
        <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <EventForm
  onClose={() => setShowForm(false)}
  onSuccess={fetchEvents}
/>
      )}

      {/* Table */}
      <EventTable
        events={events}
        onDelete={deleteEvent}
        onViewClients={viewClients}
      />

      {/* Modal */}
      <ClientsModal
        event={selectedEvent}
        clients={clients}
        onClose={() => setSelectedEvent(null)}
      /> 

    </div>
  );
}