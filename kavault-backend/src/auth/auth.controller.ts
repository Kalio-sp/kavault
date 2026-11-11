import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  // Защищаем этот маршрут
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('preferences')
  updatePreferences(
    @Request() req,
    @Body()
    body: {
      studyLanguage?: string;
      showProgramming?: boolean;
      onboardingCompleted?: boolean;
    },
  ) {
    return this.authService.updatePreferences(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('achievements')
  getAchievements(@Request() req) {
    return this.authService.getAchievements(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('achievements/unlock')
  unlockAchievements(
    @Request() req,
    @Body('ids') ids: string[],
  ) {
    return this.authService.unlockAchievements(req.user.userId, ids);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('password')
  changePassword(
    @Request() req,
    @Body() body: { currentPass: string; newPass: string },
  ) {
    return this.authService.changePassword(
      req.user.userId,
      body.currentPass,
      body.newPass,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('account')
  deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user.userId);
  }
}
