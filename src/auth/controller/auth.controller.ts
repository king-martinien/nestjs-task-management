import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { SigninResponseInterface } from '../interface/signin-response.interface';
import { JwtGuard } from '../guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Observable<void> {
    return this._authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Observable<SigninResponseInterface> {
    return this._authService.signIn(authCredentialsDto);
  }

  @Get('test')
  @UseGuards(JwtGuard)
  test() {}
}
