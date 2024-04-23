const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const viewsRouter = require('./routes/views.routs')

const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`))

// envio de informacion mediante formulario y JSON
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', viewsRouter)

const httpServer = app.listen(8080, () =>{
    console.log('Servidor listo!')
})

const io = new Server(httpServer)

const messageHistory = []

io.on('connection', (clientSocket)=>{
    console.log(`Nuevo cliente conectado => ${clientSocket.id}`)

    // enviar todos los mensajes 
    for(const data of messageHistory){
        clientSocket.emit('message', data)
    }

    clientSocket.on('message', (data)=>{
        messageHistory.push(data)
        io.emit('message', data)
    })
    
    clientSocket.on('user-connected', (username)=>{
        // notificar a los otros usuarios que un cliente se conecto
        clientSocket.broadcast.emit('user-joined', username)
    })

})