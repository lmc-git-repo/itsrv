<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'ITS-LMC') }}</title>

    <!-- LMC WHITE LOGO FAVICON -->
    <link rel="icon" type="image/png" href="{{ asset('favicon/lmc-white.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link
        href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
        rel="stylesheet"
    />

    {{-- Ziggy routes --}}
    @routes

    {{-- Inertia head --}}
    @inertiaHead

    {{-- 
        CORE INERTIA BOOTSTRAP (ALWAYS REQUIRED)
        This MUST load on ALL pages including login
    --}}
    @viteReactRefresh
    @vite('resources/js/app.jsx')

    {{--
        PAGE-LEVEL LAZY LOADING
        Only load the current page component
        (Inertia already lazy-loads internally, but this keeps things explicit)
    --}}
    @isset($page['component'])
        @vite("resources/js/Pages/{$page['component']}.jsx")
    @endisset
</head>

<body class="font-sans antialiased">
    @inertia
</body>
</html>