import { Module } from "@nestjs/common";
import { SuperheroService } from "./superhero.service";
import { SuperheroController } from "./superhero.controller";
import { SuperHero, SuperHeroSchema } from "src/db/models/SuperHero.schema";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperHero.name, schema: SuperHeroSchema },
    ]),
  ],
  controllers: [SuperheroController],
  providers: [SuperheroService],
})
export class SuperheroModule {}
