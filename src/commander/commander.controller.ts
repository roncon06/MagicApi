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
@Roles(Role.User)
export class CommanderController {
  constructor(private readonly commanderService: CommanderService) {}
  
  
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

    // Passo 3: Combinar o comandante com as 99 cartas e salvar em um arquivo JSON
    const deck = [commanderCard, ...cardsResponse.data.cards];
    const data = JSON.stringify(deck, null, 2);
    fs.writeFileSync('deck.json', data);

    return { message: 'Deck criado com sucesso!', deck };
  }

  @Get()
  getDeck() {
    const deck = fs.readFileSync('deck.json', 'utf8');
    console.log(JSON.parse(deck));
    return JSON.parse(deck);
  }
}
