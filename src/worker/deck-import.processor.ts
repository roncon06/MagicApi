import { Injectable, OnModuleInit } from '@nestjs/common';
import { rabbitmqConfig } from 'src/config/rabbitmq.config';
import * as amqp from 'amqplib';

@Injectable()
export class DeckImportProcessor implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      // Estabelecer conexão com RabbitMQ
      this.connection = await amqp.connect(rabbitmqConfig.uri);
      this.channel = await this.connection.createChannel();

      // Garantir que a fila de importação está criada
      await this.channel.assertQueue(rabbitmqConfig.queues.importDeck, { durable: true });

      console.log(`Listening on queue: ${rabbitmqConfig.queues.importDeck}`);

      // Consumir mensagens da fila
      this.channel.consume(
        rabbitmqConfig.queues.importDeck,
        async (msg) => {
          if (msg) {
            const deckData = JSON.parse(msg.content.toString());
            console.log('Processing deck:', deckData);

            // Processar a importação do baralho
            await this.processDeckImport(deckData);

            // Enviar mensagem para a fila de atualizações
            await this.channel.sendToQueue(
              rabbitmqConfig.queues.deckUpdates,
              Buffer.from(JSON.stringify(deckData)),
            );

            // Confirmação da mensagem
            this.channel.ack(msg);
          }
        },
        { noAck: false },
      );
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
    }
  }

  private async processDeckImport(deckData: any) {
    // Lógica de processamento do deck
    console.log('Importing deck:', deckData);

    // Exemplo de validação ou integração adicional
    // await this.someService.validateDeck(deckData);
  }
}
