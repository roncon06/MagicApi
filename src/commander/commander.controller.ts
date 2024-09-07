import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommanderService } from './commander.service';
import { CreateCommanderDto } from './dto/create-commander.dto';
import { UpdateCommanderDto } from './dto/update-commander.dto';
import * as fs from 'fs';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/decorator.ts/role.decorator';
import { RolesGuard } from 'src/roles/role.guard';

@Controller('commander')
@UseGuards(AuthGuard, RolesGuard) 
@Roles(Role.User, Role.Admin)
export class CommanderController {
  constructor(private readonly commanderService: CommanderService) {}

  // Buscar o comandante pelo nome e criar o deck
  @Get(':commanderName')
  async createDeck(@Param('commanderName') commanderName: string) {
    // Passo 1: Buscar o comandante
    const commanderResponse = await this.commanderService.getCommander(commanderName);
    const commanderCard = commanderResponse.data.cards[0];

    if (!commanderCard) {
      return { message: 'Comandante não encontrado.' };
    }

    // Passo 2: Buscar as 99 cartas baseadas nas cores do comandante
    const colors = commanderCard.colors; // Cores do comandante
    const cardsResponse = await this.commanderService.getCardsForColors(colors);

    // Passo 3: Combinar o comandante com as 99 cartas
    const deck = [commanderCard, ...cardsResponse.data.cards];

    // Passo 4: Salvar o deck no MongoDB
    const savedDeck = await this.commanderService.createAndSaveDeck(commanderCard.name, colors, deck);

    return { message: 'Deck criado e salvo com sucesso!', savedDeck };
  }

  // Buscar o deck salvo no banco de dados (por exemplo, por nome do comandante)
  @Get('decks/all')
  async getDeck() {
    const decks = await this.commanderService.getAllDecks(); // Implementaremos essa função para buscar os decks
    return decks;
  }
}