import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
  BadRequestException,
  Get,
} from "@nestjs/common";
import { validate as isUuid } from "uuid";

import { Request } from "express";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { UserAuthGuard } from "src/Gards/loginAuthGard";
import { setupSession } from "src/session/setupSession";
import { AuthenticatedRequest } from "src/interfaces/authenticated-request.interface";
import { QueryExceptionFilter } from "src/filters/postQuery-exceptions";
import { ResponseInterceptor } from "src/interceptors/response.interceptor";
import { AllExceptionsFilter } from "src/filters/all-exceptions.filter";
import { AuthGuard } from "@nestjs/passport";
import { todo } from "node:test";

@Controller("auth")
@UseFilters(AllExceptionsFilter) // выбрасывает ошибки
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(QueryExceptionFilter)
  @UseGuards(UserAuthGuard)
  @Post("login")
  async login(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const user = req.user; // Пользователь, добавленный Guard
    console.log(user, "controller");
    const session = await this.authService.login(user);

    // Устанавливаем cookies через утилиту
    setupSession(res, session);

    // Отправляем ответ с accessToken
    res.status(200).json({
      status: 200,
      message: "Successfully logged in user!",
      data: { accessToken: session.accessToken },
    });
  }
  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, sessionId } = req.cookies;

    if (!isUuid(sessionId)) {
      throw new BadRequestException("Invalid session ID format");
    }
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: "Refresh token is required",
      });
    }

    const session = await this.authService.refresh(sessionId, refreshToken);

    // Устанавливаем cookies через утилиту
    setupSession(res, session);
    //TODO: make auth with google
    // Отправляем ответ с accessToken
    res.status(200).json({
      status: 200,
      message: "Successfully refreshed session!",
      data: { accessToken: session.accessToken },
    });
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, sessionId } = req.cookies;

    await this.authService.logout(sessionId, refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    res.status(204).json({
      status: 204,
      message: "Successfully logged out user!",
      data: [],
    });
  }

  @Get()
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req, @Res() res) {
    return this.authService.googleLogin(req);
  }
}
