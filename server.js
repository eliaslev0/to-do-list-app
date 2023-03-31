const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, "public")))

// start server
server.listen(PORT, () => console.log(`server running on port ${PORT}`))

// // handle socket connection request from web client
// const connections = [null, null]
// io.on('connection', socket => {
//     // console.log('new ws connection')
//     // find an available player number
//     let playerIndex = -1;
//     for (const i in connections) {
//         if (connections[i] === null) {
//             playerIndex = i
//             break
//         }
//     }

    
//     // tell the connecting client what player they are
//     socket.emit('player-number', playerIndex)

//     console.log(`Player ${playerIndex} has connected`)
//     socket.broadcast.emit('player-connection', playerIndex)


//     // ignore player 3
//     if (playerIndex === -1) return;

//     connections[playerIndex] = false
//     console.log('player-connection ' + playerIndex)
//     socket.broadcast.emit('player-connection', playerIndex)

//     // handle disconnect
//     socket.on('disconnect', () => {
//         console.log(`player ${playerIndex} disconnected`)
//         connections[playerIndex] = null
//         socket.broadcast.emit('player-connection', playerIndex)
//     })

//     socket.on('set-piece', column => {
//         // console.log("HERE2HERE2 " + column)
//         io.emit('set-piece-2', column)
//         // setPiece(column)
//     })
    
// })
