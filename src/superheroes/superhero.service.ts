import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SuperHero, SuperHeroDocument } from "src/db/models/SuperHero.schema";
import { SuperHeroDto, UpdateSuperHeroDto } from "../dto/Superhero.dto";

@Injectable()
export class SuperheroService {
  constructor(
    @InjectModel(SuperHero.name)
    private superheroModel: Model<SuperHeroDocument>
  ) {}

  async getById(id: string) {
    const superhero = await this.superheroModel.findById(id).exec();

    if (!superhero) {
      throw new NotFoundException(`Superhero with id ${id} not found`);
    }

    return superhero;
  }

  async create(createSuperheroDto: SuperHeroDto) {
    const createdSuperhero =
      await this.superheroModel.create(createSuperheroDto);
    return createdSuperhero;
  }
  async patch(id: string, updateSuperheroDto: UpdateSuperHeroDto) {
    const updatedSuperhero = await this.superheroModel
      .findByIdAndUpdate(id, updateSuperheroDto, { new: true })
      .exec();

    if (!updatedSuperhero) {
      throw new NotFoundException(`Superhero with id ${id} not found`);
    }

    return updatedSuperhero;
  }

  async delete(id: string) {
    const deletedSuperhero = await this.superheroModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedSuperhero) {
      throw new NotFoundException(`Superhero with id ${id} not found`);
    }

    return [];
  }
}
