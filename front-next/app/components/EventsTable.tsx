// components/EventsTable.tsx
import Link from 'next/link';
import Button from './ui/button';

type Event = {
  id: number;
  title: string;
  participantCount: number;
  isOwner: boolean;
};

type EventsTableProps = {
  events: Event[];
};

export default function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Participantes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event, index) => (
            <tr key={event.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/events/${event.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 font-medium">
                  {event.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{event.participantCount}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-3">
                {event.isOwner ? (
                  <>
                    <Link href={`/events/${event.id}/edit`} className="text-blue-600 hover:underline">
                      Editar
                    </Link>
                    <form action="/api/events/delete" method="POST" className="inline">
                      <input type="hidden" name="eventId" value={event.id} />
                      <Button
                        variant="danger"
                        type="submit"
                        onClick={(e) => !confirm('Tem certeza?') && e.preventDefault()}
                      >
                        Excluir
                      </Button>
                    </form>
                  </>
                ) : (
                  <span className="text-gray-500">Somente visualização</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}