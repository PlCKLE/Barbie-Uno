//This script Initializes the backend server and websocket

import express from "express"
import routes from "./API/routes.js"
import cors from "cors"
import { Server } from "socket.io"
import { initializeWebSocketHandlers } from "./websocket/websocket-connection-handler.js";
import http from "http"

export const app = express();
const port = 5000;

//Include the API routes from API folder.
app.use("/",routes)


app.use((req,res) => {
    res.status(404).json({
        success: false,
        error: "Route not found.",
        path: req.path
    })
})




//Creates a websocket server
const websocketServer = http.createServer(app);
//Creates the websocket
const websocket = new Server(websocketServer, {cors:{ origin: ["http://localhost:5173"] }});

//Function inserts handlers from websocket folder into newly created websocket server.
initializeWebSocketHandlers(websocket);

//Starts server on the specified port
websocketServer.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})