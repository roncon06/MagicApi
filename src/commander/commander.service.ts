import { Injectable } from '@nestjs/common';
import { CreateCommanderDto } from './dto/create-commander.dto';
import { UpdateCommanderDto } from './dto/update-commander.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { DeckService } from 'src/deck/deck.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class CommanderService {
  private readonly baseUrl = process.env.BASEURL;

  constructor(
    private readonly httpService: HttpService,
    private readonly deckService: DeckService
  ) {}

  // Buscar um comandante específico pelo nome
  async getCommander(name: string): Promise<any> {
    const url = `https://api.magicthegathering.io/v1/cards?name=${name}&types=creature&supertype=legendary`;
    const response = this.httpService.get(url);
    return await lastValueFrom(response);
  }

  // Buscar cartas baseadas nas cores do comandante
  async getCardsForColors(colors: string[]): Promise<any> {
    const colorQuery = colors.join(',');
    const url = `https://api.magicthegathering.io/v1/cards?colors=${colorQuery}&pageSize=99`;
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

    async getAllDeck(userId: string): Promise<any> {
      return await this.deckService.getDecksByUser(userId); // Você precisa implementar essa função no DeckService
    }

     // Função para validar se o baralho segue as regras do formato Commander
  async validateCommanderDeck(commanderName: string, cards: string[], providedColors?: string[]): Promise<boolean> {
    const commanderCard = await this.getCommander(commanderName);
    if (!commanderCard || commanderCard.data.cards.length === 0) {
      return false; // Comandante inválido
    }

    const commanderColors = commanderCard.data.cards[0].colors || [];

    // Verifica a contagem de cartas
    if (cards.length !== 99) {
      return false; // O deck deve ter 99 cartas além do comandante
    }

    // Verifica se todas as cartas estão dentro das cores do comandante
    const invalidCards = await Promise.all(cards.map(card => this.isCardInColors(card, commanderColors)));
    return !invalidCards.includes(false); // Retorna true se todas as cartas são válidas
  }

  // Método para verificar se uma carta pertence às cores do comandante
  private async isCardInColors(cardName: string, allowedColors: string[]): Promise<boolean> {
    const card = await this.getCommander(cardName); // Reutiliza a função getCommander
    if (!card || card.data.cards.length === 0) {
      return false; // Carta inválida
    }

    const cardColors = card.data.cards[0].colors || [];
    return cardColors.some(color => allowedColors.includes(color));
  }
  

}