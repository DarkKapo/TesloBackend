import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  //Enviar mensajes a todos los usuarios
  @WebSocketServer() wss: Server

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection( client: Socket ) {
    this.messagesWsService.registerClient( client )
    //emitir el mensaje a todos
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient( client.id )
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto ){
    console.log(client.id, payload);
  }
}
