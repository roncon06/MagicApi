// src/deck/deck.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck } from './schemas/deck.schema';

@Injectable()
export class DeckService {
  constructor(@InjectModel('Deck') private readonly deckModel: Model<Deck>) {}

  // Função para salvar o deck
  async saveDeck(commanderName: string, colors: string[], cards: any[]): Promise<Deck> {
    const createdDeck = new this.deckModel({
      commanderName,
      colors,
      cards,
    });
    return await createdDeck.save();
  }
}
