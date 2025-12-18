@extends('Layouts.main')
@section('title', 'dashboard')

@section('content')

<div class="col-md-10 offset-md-1 dashboard-title-container">
    <h1>Meus eventos</h1>
</div>

<div class="row">
    <p>Aqui estão os eventos que você criou ou está participando:</p>

    @if(!empty($events) && $events->count() > 0)

        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Participantes</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>

            <tbody>
                @foreach($events as $event)
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>

                    <td>
                        <a href="/events/{{ $event->id }}">
                            {{ $event->title }}
                        </a>
                    </td>

                    <td>participantes</td>

                    <td>
                        <a href="/events/edit/{{ $event->id }}" class="btn btn-info">Editar</a>
                        <form action="/events/{{ $event->id }}" method="POST" style="display:inline-block;">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger">Excluir</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

    @else
        <p>Você não tem eventos. 
            <a href="/events/create">Criar evento</a>
        </p>
    @endif

</div>

@endsection

