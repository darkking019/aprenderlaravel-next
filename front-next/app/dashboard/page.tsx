// app/dashboard/page.tsx
import { createSupabaseServer } from '../lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardTitle from '../components/DashboardTitle';
import EventsTable from '../components/EventsTable';
import EmptyState from '../components/EmptyState';

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Eventos criados pelo usuário
  const { data: createdEvents } = await supabase
    .from('events')
    .select('id, title, user_id')
    .eq('user_id', user.id);

  // 2. IDs dos eventos que o usuário participa
  const { data: participantIds } = await supabase
    .from('participants')
    .select('event_id')
    .eq('user_id', user.id);

  const participatedEventIds = participantIds?.map((p: any) => p.event_id) || [];

  // 3. Busca os eventos participados
  let participatedEvents: any[] = [];
  if (participatedEventIds.length > 0) {
    const { data } = await supabase
      .from('events')
      .select('id, title, user_id')
      .in('id', participatedEventIds);
    participatedEvents = data || [];
  }

  // 4. Junta criados + participados
  const allEvents = [...(createdEvents || []), ...participatedEvents];

  // 5. Remove duplicados (caso o usuário crie e participe do mesmo evento)
  const uniqueEvents = allEvents.filter(
    (event, index, self) => index === self.findIndex((e) => e.id === event.id)
  );

  // 6. Adiciona contagem de participantes e se é dono
  const eventsWithParticipants = await Promise.all(
    uniqueEvents.map(async (event) => {
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);

      return {
        id: event.id,
        title: event.title,
        participantCount: count || 0,
        isOwner: event.user_id === user.id,
      };
    })
  );

  // Agora sim, usa a variável que foi criada acima
  return (
    <div className="max-w-6xl mx-auto p-6">
      <DashboardTitle>Meus eventos</DashboardTitle>

      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        Aqui estão os eventos que você criou ou está participando:
      </p>

      {eventsWithParticipants.length > 0 ? (
        <EventsTable events={eventsWithParticipants} />
      ) : (
        <EmptyState
          message="Você não tem eventos."
          linkText="Criar evento"
          linkHref="/events/create"
        />
      )}
    </div>
  );
}