async function handleDelete(eventId) {
  if (!confirm('Tem certeza?')) return

  await api.delete(`/events/${eventId}`)
  location.reload()
}

async function handleLeave(eventId) {
  await api.delete(`/events/${eventId}/leave`)
  location.reload()
}
