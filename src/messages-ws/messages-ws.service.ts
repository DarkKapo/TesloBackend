import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    //id cliente se asigna a un Socket
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {
    private connectedClients: ConnectedClients = {}

    //Registrar al cliente cuando conecta
    registerClient( client: Socket ) {
        this.connectedClients[client.id] = client
    }

    //Remover el cliente cuando desconecta
    removeClient( clientId: string){
        delete this.connectedClients[clientId]
    }
    
    //Contar clientes conectados
    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients )
    }
}
