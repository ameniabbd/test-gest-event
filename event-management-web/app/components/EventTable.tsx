"use client";

export default function EventTable({
  events,
  onDelete,
  onViewClients,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3">Date</th>
            <th className="p-3">Lieu</th>
            <th className="p-3">Participants</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event: any) => (
            <tr key={event.id} className="border-t hover:bg-gray-50">

         
              <td className="p-3 font-medium text-gray-600 ">
                {event.title}
              </td>

            
              <td className="p-3 text-gray-600 max-w-xs truncate">
                {event.description}
              </td>

            
              <td className="p-3 text-gray-600 " >
                {new Date(event.date).toLocaleDateString()}
              </td>

            
              <td className="p-3 text-gray-600 ">
              {event.location}
              </td>

           
              <td className="p-3 text-gray-600 ">
                 {event.participants_count}
              </td>

            
              <td className="p-3 text-center space-x-2">

                <button
                  onClick={() => onViewClients(event)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                >
                  Détails
                </button> 

                <button
                  onClick={() => onDelete(event.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Supprimer
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}