import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private _connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this._userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not found');

    this._checkUserConnection(user);

    this._connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this._connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this._connectedClients);
  }

  getUserFullName(socketId: string) {
    return this._connectedClients[socketId].user.fullName;
  }

  private _checkUserConnection(user: User) {
    for (const clientId of Object.keys(this._connectedClients)) {
      const connectedClient = this._connectedClients[clientId];
      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
