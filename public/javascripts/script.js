var socket = io()
socket.on('chat message', function (data) {
  let messages = $('#messages')

  messages.append(`<li>
  <div class="message">
    <h1>${data.user}</h1> 
    <p>${data.msg}</p>
  </div></li>`)

  if (messages.children().length > 50) {
    messages.find('li:first').remove()
  }

  $('.messages-div').scrollTop(Number.MAX_SAFE_INTEGER)
})

const textarea = $('textarea')
textarea.keypress(function (e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    let message = textarea.val()
    if ($.trim(message).length > 0) {
      socket.emit('chat message', message)
      textarea.val('')
    }
  }
})
