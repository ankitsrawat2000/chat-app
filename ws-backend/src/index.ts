import { WebSocketServer, WebSocket} from 'ws';
const wss = new WebSocketServer({ port : 8081});

interface User {
    socket: WebSocket;
    room: string;
}

let userCount = 0;
let allSockets :User[] = [];

wss.on("connection", (socket) => {    

    socket.on("message", (message) => {
        // {
        //     "type": "join",
        //     "payload" : {
        //         "roomId": "red"
        //     }
        // }
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
                if(parsedMessage.type === "join"){
                        allSockets.push({
                                socket,
                                room: parsedMessage.payload.roomId
                        })
                }

                if(parsedMessage.type === "chat"){
                        const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;
                        if(!currentUserRoom) return;
                        // broadcast to all sockets in same room (including sender)
                        allSockets
                            .filter(x => x.room === currentUserRoom)
                            .forEach(u => {
                                try {
                                    u.socket.send(parsedMessage.payload.message);
                                } catch (e) {
                                    // ignore send errors per-socket
                                }
                            })

                }

    })
})

wss.on('connection', (s) => {
    // remove socket when it closes
    s.on('close', () => {
        allSockets = allSockets.filter(u => u.socket !== s);
    })
})