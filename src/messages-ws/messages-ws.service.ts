import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    //id cliente se asigna a un Socket
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesWsService {
    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    //Registrar al cliente cuando conecta
    async registerClient( client: Socket, userId: string ) {
        const user = await this.userRepository.findOneBy( { id: userId })

        if( !user ) throw new Error('User not found')
        if( !user.isActive ) throw new Error('User not active')

        this.connectedClients[client.id] = {
            socket: client,
            user: user
        }
    }

    //Remover el cliente cuando desconecta
    removeClient( clientId: string){
        delete this.connectedClients[clientId]
    }
    
    //Contar clientes conectados
    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients )
    }

    //Devolver nombre
    getUserFullName( socketId: string){
        return this.connectedClients[socketId].user.fullname
    }
}
