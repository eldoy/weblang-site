(function() {
  var socket = function(url, opt) {
    if (!opt) opt = {}
    if (typeof opt.timeout == 'undefined') opt.timeout = 1

    // Variables
    var socket, events = {}

    // Events
    var EVENTS = ['message', 'open', 'close', 'error']
    for (var i = 0; i < EVENTS.length; i++) {
      events[EVENTS[i]] = []
    }

    // Register events
    function on(name, fn) {
      events[name].push(fn)
    }

    function run(name, ...args) {
      for (var i = 0; i < events[name].length; i++) {
        events[name][i](...args)
      }
    }

    function open(resolve, reject) {
      socket = new WebSocket(url)

      socket.onmessage = function(event) {
        var data = JSON.parse(event.data)
        run('message', data, event)
      }

      socket.onopen = function(event) {
        if (resolve) resolve(api)
        run('open', api, event)
      }

      socket.onerror = function(event) {
        if (reject) reject(event)
        run('error', event)
      }

      socket.onclose = function(event) {
        if (opt.timeout) {
          setTimeout(open, opt.timeout)
        }
        run('close', event)
      }
    }

    function close(code) {
      socket.close(code || 1000)
    }

    function send(params) {
      if (socket.readyState == 1) {
        socket.send(JSON.stringify(params))
      }
    }

    var api = {
      on,
      open,
      send,
      close
    }

    return new Promise(open)
  };
  var http = function(url, params, options) {
    return new Promise(function(resolve, reject) {
      if (!options) options = {}
      if (!params) params = {}
      var xhr = new XMLHttpRequest()
      xhr.addEventListener('load', function() {
        var json = JSON.parse(xhr.responseText)
        resolve(json)
      })
      xhr.addEventListener('error', function() {
        reject(xhr)
      })
      xhr.open(options.method || 'POST', url + (options.path || ''))
      // Set up upload if we have files
      var data
      if (options.files) {
        data = new FormData()
        // Add params to data
        for (var key in params) {
          data.append(key, JSON.stringify(params[key]))
        }
        // Loop through each of the selected files
        for (var file of options.files) {
          data.append('file', file, file.name)
        }
        if (options.progress) {
          xhr.upload.addEventListener('progress', function(event) {
            event.percent = (event.loaded / event.total * 100).toFixed(2)
            options.progress(event)
          })
        }
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
      }
      if (options.headers) {
        for (var key in options.headers) {
          xhr.setRequestHeader(key, options.headers[key])
        }
      }
      // Send data to server
      xhr.withCredentials = true
      xhr.send(data || JSON.stringify(params))
    })
  };
  window.waveorb = function(url, config = {}) {
    if (!url.indexOf('ws')) {
      return socket(url, config)
    }
    return function(data = {}, options = {}) {
      return http(url, data, options)
    }
  }
}())