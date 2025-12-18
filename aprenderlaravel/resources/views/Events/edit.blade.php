@extends('Layouts.main')
@section('title', 'editando: ' . $event->title)

@section('content')
<div id="create-event-container" class="col-md-6 offset-md-3">
<h1>editando:{{ $event->title }}</h1>
   <form action="{{ route('events.update', $event->id) }}" method="POST" enctype="multipart/form-data">
   
        @csrf
        @method('PUT')
         <div class="form-group">
            <label for="image">imagem do evento:</label>
            <input type="file" id="image" name="image" class="form-control-file">
            <img src="/img/events/{{ $event->image }}" alt="{{ $event->title }}" class="img-preview">

        </div>
        <div class="form-group">
            <label for="title">Evento:</label>
            <input type="text" class="form-control" id="title" name="title" placeholder="nome do evento" value="{{ $event->title }}">
        </div>
           <div class="form-group">
            <label for="date">Data:</label>
            <input type="date" class="form-control" id="date" name="date" placeholder="data do evento" value="{{ $event->date }}">
        </div> 
          <div class="form-group">
            <label for="description">descrição</label>
            <textarea name="description" id="description" class="form-control" placeholder="o que acontece no evento?">{{ $event->description }}</textarea>
        </div> 
          <div class="form-group">
            <label for="title"> o evento é privado?</label>
           <select name="private" id="private" class="form-control">
           <option value="0">não</option>
           <option value="1" {{ $event->private == 1 ? 'selected': "" }}>sim</option>
           </select>
        </div> 
          <div class="form-group">
            <label for="city">cidade:</label>
            <input type="text" class="form-control" id="city" name="city" placeholder="cidade do evento" value="{{ $event->city }}">
        </div>
        
        
         <div class="form-group">
            <label for="items">itens:</label>
            <input type="checkbox" name="items[]"  value="cadeiras" > cadeiras
            <input type="checkbox" name="items[]"  value="palco" > palco
            <input type="checkbox" name="items[]"  value="cerveja grátis" > cerveja grátis
            <input type="checkbox" name="items[]"  value="open food" > open food
            <input type="checkbox" name="items[]"  value="brindes" > brindes
        </div> 
         <input type="submit" class="btn btn-primary" value="atualizar evento">
    </form>
  </div>   





@endsection
