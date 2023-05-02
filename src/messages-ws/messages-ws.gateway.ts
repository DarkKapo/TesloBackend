import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  //Enviar mensajes a todos los usuarios
  @WebSocketServer() wss: Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    //Importar JwtServices para validar el token
    private readonly jwtService: JwtService
  ) {}

  handleConnection( client: Socket ) {
    //as string es para que lo trate como un string
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload
    try {
      //Verificar el token
      payload = this.jwtService.verify( token )
    } catch (error) {
      //desconecta al cliente
      client.disconnect()
      return
    }
    
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
    //Mensaje que se entrega al mismo cliente
    // client.emit('message-from-server', {
    //   FullName: 'Yo',
    //   message: payload.message || 'no-message'
    // })

    // Emitir a todos menos al cliente
    // client.broadcast.emit('message-from-server', {
    //   FullName: 'Yo',
    //   message: payload.message || 'no-message'
    // })

    //Emitir mensajes a todos
    this.wss.emit('message-from-server', {
      fullName: 'Yo',
      message: payload.message || 'no-message'
    })
  }
}
