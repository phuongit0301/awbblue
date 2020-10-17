<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>AWBBLUE</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
</head>

<body>
  <div id="app"></div>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  @if(env('APP_ENV') === 'local')
    <script src="{{ asset('/js/app.js') }}"></script>
  @else
    <script src="/js/app.js"></script>
  @endif
</body>

</html>