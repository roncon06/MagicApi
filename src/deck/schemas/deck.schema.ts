// src/deck/schemas/deck.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Deck extends Document {
  @Prop({ required: true })
  commanderName: string;

  @Prop({ required: true })
  colors: string[];

  @Prop({ type: Array, default: [] })
  cards: any[];
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
