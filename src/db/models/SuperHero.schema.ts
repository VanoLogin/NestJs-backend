import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SuperHeroDocument = HydratedDocument<SuperHero>;

@Schema({ timestamps: true, versionKey: false })
export class SuperHero {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  realname: string;

  @Prop({ required: true })
  originDescription: string;

  @Prop({ required: true })
  superpowers: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  catchPhrase: string;
}

export const SuperHeroSchema = SchemaFactory.createForClass(SuperHero);
