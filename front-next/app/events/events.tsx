import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Busca TODOS os eventos que o usuário criou OU está participando
  // Primeiro: eventos criados pelo usuário
  const { data: createdEvents } = await supabase
    .from('events')
    .select('id, title, user_id')
    .eq('user_id', user.id);

  // Segundo: eventos que o usuário participa (via tabela participants)
  const { data: participantEventIds } = await supabase
    .from('participants')
    .select('event_id')
    .eq('user_id', user.id);

  const participatedEventIds = participantEventIds?.map(p => p.event_id) || [];

  // Terceiro: busca os eventos participados
  let participatedEvents: any[] = [];
  if (participatedEventIds.length > 0) {
    const { data } = await supabase
      .from('events')
      .select('id, title, user_id')
      .in('id', participatedEventIds);
    participatedEvents = data || [];
  }

  // Junta tudo em uma lista única (sem duplicar se o usuário criou e participa do mesmo)
  const allEvents = [...createdEvents || [], ...participatedEvents];

  // Remove duplicados por ID
  const uniqueEvents = allEvents.filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  );

  // Conta participantes pra cada evento
  const eventsWithParticipants = await Promise.all(
    uniqueEvents.map(async (event) => {
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);

      return {
        ...event,
        participantCount: count || 0,
        isOwner: event.user_id === user.id, // pra mostrar botão editar/excluir só pro dono
      };
    })
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Meus eventos</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Aqui estão os eventos que você criou ou está participando:
        </p>
      </div>

      {eventsWithParticipants.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {eventsWithParticipants.map((event, index) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                    >
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {event.participantCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {event.isOwner && (
                      <>
                        <Link
                          href={`/events/${event.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Editar
                        </Link>

                        <form action="/api/events/delete" method="POST" className="inline">
                          <input type="hidden" name="eventId" value={event.id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                            onClick={(e) => {
                              if (!confirm('Tem certeza que quer excluir esse evento?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Excluir
                          </button>
                        </form>
                      </>
                    )}
                    {!event.isOwner && (
                      <span className="text-gray-500 dark:text-gray-400">Somente visualização</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Você não tem eventos.
          </p>
          <Link
            href="/events/create"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Criar evento
          </Link>
        </div>
      )}
    </div>
  );
}