<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Bion Genetic') }}</title>
    @laravelPWA
</head>
<body class="font-sans antialiased">
<h1>You are currently not connected to any networks.</h1>
</body>
</html>
