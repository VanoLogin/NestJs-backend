import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  Delete,
  Patch,
} from "@nestjs/common";
import { SuperheroService } from "./superhero.service";
import { SuperHeroDto, UpdateSuperHeroDto } from "../dto/Superhero.dto";
import { createValidationPipe } from "src/utils/validation.pipe";
import { ResponseInterceptor } from "../interceptors/response.interceptor";
import { ValidateIdPipe } from "../utils/validationId.pipe";

@Controller("superhero")
@UseInterceptors(ResponseInterceptor)
export class SuperheroController {
  constructor(private readonly superheroService: SuperheroService) {}

  @Get(":id")
  @UsePipes(new ValidateIdPipe())
  async getbyId(@Param("id") id: string) {
    const response = await this.superheroService.getById(id);
    return response;
  }
  @Patch(":id")
  @UsePipes(new ValidateIdPipe())
  async updateSuperhero(
    @Param("id") id: string,
    @Body() updateSuperHeroDto: UpdateSuperHeroDto
  ) {
    const response = await this.superheroService.patch(id, updateSuperHeroDto);
    return response;
  }

  @Post()
  @UsePipes(createValidationPipe())
  async createSuperhero(@Body() createSuperheroDto: SuperHeroDto) {
    const response = await this.superheroService.create(createSuperheroDto);
    return response;
  }
  @Delete(":id")
  @UsePipes(new ValidateIdPipe())
  async deleteSuperHero(@Param("id") id: string) {
    return await this.superheroService.delete(id);
  }
}
