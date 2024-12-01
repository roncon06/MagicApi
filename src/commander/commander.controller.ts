import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Inject } from '@nestjs/common';
import { CommanderService } from './commander.service';
import { CreateCommanderDto } from './dto/create-commander.dto';
import { UpdateCommanderDto } from './dto/update-commander.dto';
import * as fs from 'fs';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/decorator.ts/role.decorator';
import { RolesGuard } from 'src/roles/role.guard';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ImportDeckDto } from 'src/deck/dto/import-deck.dto';
import { ClientProxy } from '@nestjs/microservices';


@Controller('commander')
@UseGuards(AuthGuard, RolesGuard) 
@Roles(Role.User, Role.Admin)
export class CommanderController {
  constructor(private readonly commanderService: CommanderService,
  ) {}

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

  // Buscar o deck salvo no banco de dados (por exemplo, por nome do comandante)

  @Get('decks/all')
  @CacheKey('items') // chave para o cache
  @CacheTTL(30)
  async getDeck() {
    const decks = await this.commanderService.getAllDecks(); // Implementaremos essa função para buscar os decks
    return decks;
  }


   // Rota para importar um baralho
   @Post('import')
   async importDeck(@Body() importDeckDto: ImportDeckDto) {
     const { commanderName, colors, cards } = importDeckDto;
 
  
 
     // Se for válido, você pode salvar o deck no banco de dados
     const savedDeck = await this.commanderService.createAndSaveDeck(commanderName, colors || [], cards);
     return { message: 'Deck importado e salvo com sucesso!', savedDeck };
   }
  
}