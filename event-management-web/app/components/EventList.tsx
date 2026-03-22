import EventCard from "./EventCard";

export default function EventList({ events, onDelete }: any) {
  return (
    <div className="grid gap-4">
      {events.map((event: any) => (
        <EventCard key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}