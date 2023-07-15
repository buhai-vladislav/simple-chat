import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/Auth';
import { CreateUserDto } from 'src/dtos/CreateUser';
import { Response } from 'express';
import { SigninDto } from '../dtos/Signin';
import { PublicRoute } from '../guards/PublicRoute';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('/signup')
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    return this.authService.signup(createUserDto, res);
  }

  @PublicRoute()
  @Post('/signin')
  public async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    return this.authService.signin(signinDto, res);
  }

  @Get('/self')
  public async self(@Res() res: Response, @Req() req: any) {
    const userId = req.user.id;
    return this.authService.getSelf(userId, res);
  }
}
