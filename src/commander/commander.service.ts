import { Injectable } from '@nestjs/common';
import { CreateCommanderDto } from './dto/create-commander.dto';
import { UpdateCommanderDto } from './dto/update-commander.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { DeckService } from 'src/deck/deck.service';

@Injectable()
export class CommanderService {
  private readonly baseUrl = process.env.BASEURL;

  constructor(
    private readonly httpService: HttpService,
    private readonly deckService: DeckService
  ) {}

  // Buscar um comandante específico pelo nome
  async getCommander(name: string): Promise<any> {
    const url = `${this.baseUrl}/cards?name=${name}&types=creature&supertype=legendary`;
    const response = this.httpService.get(url);
    return await lastValueFrom(response);
  }

  // Buscar cartas baseadas nas cores do comandante
  async getCardsForColors(colors: string[]): Promise<any> {
    const colorQuery = colors.join(',');
    const url = `${this.baseUrl}/cards?colors=${colorQuery}&pageSize=99`;
    const response = this.httpService.get(url);
    return await lastValueFrom(response);
  }

  // Função para criar e salvar um deck no MongoDB
  async createAndSaveDeck(commanderName: string, colors: string[], cards: any[]): Promise<any> {
    return await this.deckService.saveDeck(commanderName, colors, cards);
  }

    // Função para buscar todos os decks salvos
    async getAllDecks(): Promise<any> {
      return await this.deckService.getDecks();
    }
  

}