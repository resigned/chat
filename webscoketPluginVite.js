import injectSocketIO from "./socketIOServer";

export const websocketServer = {
    name: 'webSocket Server',
    configureServer(server) {
        injectSocketIO(server.httpServer)
    }
}