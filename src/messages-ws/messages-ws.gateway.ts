import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly _messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this._messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this._messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this._messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this._messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite únicamente al cliente inicial
    /*client.emit('message-from-server', {
      fullName: 'Hello from server',
      message: payload.message || 'no-message',
    });*/

    //! Emite a todos MENOS al cliente inicial
    /* client.broadcast.emit('message-from-server', {
      fullName: 'Hello from server',
      message: payload.message || 'no-message',
    }); */

    this.wss.emit('message-from-server', {
      fullName: this._messagesWsService.getUserFullName(client.id),
      message: payload.message || 'error',
    });
  }
}
