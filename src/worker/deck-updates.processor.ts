import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Server } from 'socket.io';
import { rabbitmqConfig } from 'src/config/rabbitmq.config';

@Injectable()
export class DeckUpdatesProcessor implements OnModuleInit {
  private socketServer: Server;
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    // Inicializar o servidor WebSocket
    this.socketServer = new Server(3001, { cors: { origin: '*' } }); // Permitir conexões de qualquer origem
    console.log('WebSocket Server started on port 3001');
  }

  async onModuleInit() {
    try {
      // Conectar ao RabbitMQ
      this.connection = await amqp.connect(rabbitmqConfig.uri);
      this.channel = await this.connection.createChannel();

      // Garantir que a fila de atualizações está criada
      await this.channel.assertQueue(rabbitmqConfig.queues.deckUpdates, { durable: true });

      console.log(`Listening on queue: ${rabbitmqConfig.queues.deckUpdates}`);

      // Consumir mensagens da fila
      this.channel.consume(
        rabbitmqConfig.queues.deckUpdates,
        (msg) => {
          if (msg) {
            const updateData = JSON.parse(msg.content.toString());
            console.log('Sending update via WebSocket:', updateData);

            // Emitir evento via WebSocket
            this.socketServer.emit('deckUpdate', updateData);

            // Confirmação da mensagem
            this.channel.ack(msg);
          }
        },
        { noAck: false },
      );
    } catch (error) {
      console.error('Error initializing RabbitMQ or WebSocket:', error);
    }
  }
}
