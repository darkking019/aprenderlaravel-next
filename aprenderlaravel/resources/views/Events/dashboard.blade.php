@extends('layouts.main')

@section('title', 'Dashboard')

@section('content')
    <div class="col-md-10 offset-md-1 dashboard-title-container">
        <h1>Meus eventos criados</h1>
    </div>
    <div class="col-md-10 offset-md-1">
        @if($createdEvents->count() > 0)
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Participantes</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($createdEvents as $event)
                        <tr>
                            <td>{{ $loop->iteration }}</td>
                            <td><a href="/events/{{ $event->id }}">{{ $event->title }}</a></td>
                            <td>{{ $event->participants->count() }}</td>
                            <td>
                                <a href="/events/{{ $event->id }}/edit" class="btn btn-info btn-sm">Editar</a>
                                <form action="/events/{{ $event->id }}" method="POST" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm"
                                        onclick="return confirm('Tem certeza que deseja excluir?')">Excluir</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>Você ainda não criou nenhum evento. <a href="/events/create">Criar agora</a></p>
        @endif
    </div>

    <div class="col-md-10 offset-md-1 dashboard-title-container mt-5">
        <h1>Eventos que estou participando</h1>
    </div>
    <div class="col-md-10 offset-md-1">
        @if($participatedEvents->count() > 0)
            <div class="row">
                @foreach($participatedEvents as $event)
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            @if($event->image)
                                <img src="{{ asset('storage/events/' . $event->image) }}" class="card-img-top"
                                    alt="{{ $event->title }}">
                            @else
                                <img src="/img/event_default.jpg" class="card-img-top" alt="Sem imagem">
                            @endif
                            <div class="card-body">
                                <h5 class="card-title">{{ $event->title }}</h5>
                                <p class="card-text">{{ $event->city }} - {{ \Carbon\Carbon::parse($event->date)->format('d/m/Y') }}
                                </p>
                                <p>{{ $event->participants->count() }} participantes</p>
                                <a href="/events/{{ $event->id }}" class="btn btn-primary">Ver evento</a>

                                <form action="{{ route('events.leave', $event->id) }}" method="POST" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">Sair</button>
                                </form>
                                


                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <p>Você não está participando de nenhum evento ainda. <a href="/">Ver eventos disponíveis</a></p>
        @endif
    </div>
@endsection