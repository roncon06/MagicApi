import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Inject 
} from '@nestjs/common';
import { CommanderService } from './commander.service';
import { ImportDeckDto } from 'src/deck/dto/import-deck.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/decorator.ts/role.decorator';
import { RolesGuard } from 'src/roles/role.guard';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { rabbitmqConfig } from 'src/config/rabbitmq.config';

@Controller('commander')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.User, Role.Admin)
export class CommanderController {
  private readonly rabbitClient: ClientProxy;

  constructor(
    private readonly commanderService: CommanderService,
  ) {
    // Configuração do RabbitMQ
    this.rabbitClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqConfig.uri],
        queue: rabbitmqConfig.queues.importDeck,
        queueOptions: { durable: true },
      },
    });
  }

  // Buscar o comandante pelo nome e criar o deck
  @Get(':commanderName')
  async createDeck(@Param('commanderName') commanderName: string) {
    const commanderResponse = await this.commanderService.getCommander(commanderName);
    const commanderCard = commanderResponse.data.cards[0];

    if (!commanderCard) {
      return { message: 'Comandante não encontrado.' };
    }

    const colors = commanderCard.colors; // Cores do comandante
    const cardsResponse = await this.commanderService.getCardsForColors(colors);

    const deck = [commanderCard, ...cardsResponse.data.cards];
    const savedDeck = await this.commanderService.createAndSaveDeck(commanderCard.name, colors, deck);

    return { message: 'Deck criado e salvo com sucesso!', savedDeck };
  }

  // Buscar todos os decks salvos
  @Get('decks/all')
  @CacheKey('items') // Chave para o cache
  @CacheTTL(30)
  async getDeck() {
    const decks = await this.commanderService.getAllDecks();
    return decks;
  }

  // Importar deck com mensageria para processamento assíncrono
  @Post('import')
  async importDeck(@Body() importDeckDto: ImportDeckDto) {
    const { commanderName, colors, cards } = importDeckDto;

    // Salvar informações iniciais no banco de dados
    const savedDeck = await this.commanderService.createAndSaveDeck(commanderName, colors || [], cards);

    // Enviar mensagem para a fila de importação
    this.rabbitClient.emit(rabbitmqConfig.queues.importDeck, {
      commanderName,
      colors,
      cards,
      userId: '123', // Pode ser dinâmico, capturado do token JWT
    });

    return { message: 'Deck enviado para importação.', savedDeck };
  }
}
