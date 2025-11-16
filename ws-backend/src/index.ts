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

        if(parsedMessage === "chat"){
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;
            
            allSockets.find((x) => x.room == currentUserRoom)?.socket.send(parsedMessage.payload.message);

        }

    })
})