module.exports = async function ($) {
  const host =
    process.env.NODE_ENV == 'production'
      ? 'https://weblang.org/api'
      : 'http://localhost:5777'

  return /* html */ `
    <!doctype html>
    <html lang="${$.lang}">
      <head>
        <meta http-equiv="content-type" content="text/html;charset=utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="description" content="Weblang Low Code Programming Language">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet">
        <title>${$.page.title || '♥'} - Weblang</title>
        <link rel="icon" type="image/png" href="/img/favicon.png">
        ${$.script('/bundle.js')}
        ${$.style('/bundle.css')}
        <script>window.api = waveorb('${host}')</script>
        <script defer data-domain="weblang.org" src="https://plausible.io/js/script.js"></script>
        ${process.env.NODE_ENV == 'development' ? $.script('/js/dev.js') : ''}
      </head>
      <body>
        <header>
          <nav class="flex">
            <div>
              <a class="navbar-logo" href="${$.link('index')}">
                <img src="/img/weblang-horizontal-small.svg" height="30">
              </a>
            </div>
            <div>
              <a href="${$.link('about')}">About</a>
              <a href="https://github.com/eldoy/weblang">Code</a>
            </div>
          </nav>
        </header>
        <script>
          toggleVisibility()
          setActiveLink()
        </script>
        <div id="flash"></div>
        <main>${$.page.content}</main>
        <footer>
          Made by <a href="https://eldoy.com">Eldøy Projects</a>, Oslo, Norway
        </footer>
        <script>flash()</script>
      </body>
    </html>
  `
}
