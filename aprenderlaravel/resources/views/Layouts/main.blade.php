<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
</head>

<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light">
            <div class="collapse navbar-collapse" id="navbar">
                <a href="/" class="navbar-brand">
                    <img src="/img/icone.jpg" alt="Events"></a>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a href="{{ route('events.index') }}" class="nav-link">eventos</a>

                    </li>
                    <li class="nav-item">
                        <a href="/events/create" class="nav-link">criar eventos</a>
                    </li>
                    <li class="nav-item">

                        <a href="{{ route('contact') }}" class="nav-link">contatos</a>


                        @auth

                            <li class="nav-item">
                                <a href="/dashboard" class="nav-link">meus eventos</a>
                                <form action="/logout" method="POST">
                                    @csrf
                                    <a href="/logout" class="nav-link"
                                        onclick="event.preventDefault();this.closest('form').submit();">sair</a>
                                </form>
                        @endauth
                        @guest
                            <li class="nav-item">
                                <a href="/login" class="nav-link">entrar</a>
                            </li>
                            <li class="nav-item">
                                <a href="/register" class="nav-link">cadastrar</a>
                        @endguest
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <main>
        <div class="container-fluid">
            <div class="row">
                @if (session('msg'))
                    <p class="msg">{{ session('msg') }}</p>

                @endif


                @yield('content')
            </div>
        </div>
    </main>

    <footer>
        <p>HDC Events &copy; 2020 </p>
    </footer>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>

</html>