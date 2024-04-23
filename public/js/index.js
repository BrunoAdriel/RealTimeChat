
const socket = io()
let username
const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')
// bloquear pantalla y pedir user name

Swal.fire({
    title:'Ingresa un UserName',
    input: 'text',
    text: 'Debes elegir un nombre de usuario para continuar',
    // si ingresa una value que sea null 
    inputValidator:(value)=>{
        return !value && '¡Debes ingresar un UserName valido!'
    },
    allowOutsideClick: false
}).then(result=>{
    username = result.value
    console.log(username)

    // notificaamos al cliente se conecto
    socket.emit('user-connected', username)
})


chatBox.addEventListener('keyup', e =>{
    if(e.key === "Enter"){
        const text = chatBox.value
        // chekea que el mensaje no este vacio y "trim" elimina los espacios de atras y adelante
        if(text.trim().length > 0){
            socket.emit('message', { username, text})
            chatBox.value = ''
        }
    }
})

// Escuchar y mostrar mensajes
socket.on('message', (data)=>{
    const {username, text} = data

    messageLogs.innerHTML+= `${username} : ${text}</br>`
})

socket.on('user-joined', (username)=>{
    swal.fire({
        text: ` Nuevo usuario conectado:${username} `,
        toast: true,
        position: 'top-right'
    })

})
