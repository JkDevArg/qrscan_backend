  import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dto/login.dto';
  import { RegisterDto } from './dto/register.dto';
  import { AuthGuard } from './guard/auth.guard';
  import { RequestWithUser } from './interface/req.interface';
  import { Auth } from './decorators/auth.decorator';
  import { Role } from '../common/enums/rol.enum';



  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(
      @Body()
      registerDto: RegisterDto,
    ) {
      return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }

    @UseGuards(AuthGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
      return await this.authService.refreshToken(req.body.email);
    }

    @Get('profile')
    @Auth(Role.USER)
    profile(@Request() req: RequestWithUser) {
      // Obtenemos información del usuario logeado
      const email = req.user.email;
      return this.authService.profile({ email });
    }
  }
