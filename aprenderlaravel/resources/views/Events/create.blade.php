@extends('Layouts.main')
@section('title', 'criar evento')
@section('content')

<div id="create-event-container" class="col md-6 offset-md-3">
    <form action="/events" method="POST" enctype="multipart/form-data">
        @csrf
         <div class="form-group">
            <label for="image">imagem do evento:</label>
            <input type="file" id="image" name="image" class="form-control-file">
        </div>
        <div class="form-group">
            <label for="title">Evento:</label>
            <input type="text" class="form-control" id="title" name="title" placeholder="nome do evento">
        </div>
           <div class="form-group">
            <label for="date">Data:</label>
            <input type="date" class="form-control" id="date" name="date" placeholder="data do evento">
        </div> 
          <div class="form-group">
            <label for="description">descrição</label>
            <textarea name="description" id="description" class="form-control" placeholder="o que acontece no evento?"></textarea>
        </div> 
          <div class="form-group">
            <label for="title"> o evento é privado?</label>
           <select name="private" id="private" class="form-control">
           <option value="0">não</option>
           <option value="1">sim</option>
           </select>
        </div> 
          <div class="form-group">
            <label for="city">cidade:</label>
            <input type="text" class="form-control" id="city" name="city" placeholder="cidade do evento">
        </div>
        
        
         <div class="form-group">
            <label for="items">itens:</label>
            <input type="checkbox" name="items[]"  value="cadeiras" > cadeiras
            <input type="checkbox" name="items[]"  value="palco" > palco
            <input type="checkbox" name="items[]"  value="cerveja grátis" > cerveja grátis
            <input type="checkbox" name="items[]"  value="open food" > open food
            <input type="checkbox" name="items[]"  value="brindes" > brindes
        </div> 
         <input type="submit" class="btn btn-primary" value="criar evento">
    </form>
  </div>   
@endsection