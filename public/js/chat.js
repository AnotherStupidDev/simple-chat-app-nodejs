const socket = io()

// Elements
const $messageform = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(urlTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageform.addEventListener('submit', (e) => {
    e.preventDefault()
   
    $messageFormButton.setAttribute('disabled', 'disabled')
    // disable
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        // enable
        if (error) {
            return console.log(error)
        } 

        console.log('Delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
              
        socket.emit('sendLocation', { 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
         }, () => {
            $sendLocationButton.removeAttribute('disabled')
             console.log('Location sent!')
         })
    })


    
 })