export const rabbitmqConfig = {
    uri: 'amqp://localhost:15672', // URL do RabbitMQ
    queues: {
      importDeck: 'deck_import_queue',
      deckUpdates: 'deck_updates_queue',
    },
  };
  