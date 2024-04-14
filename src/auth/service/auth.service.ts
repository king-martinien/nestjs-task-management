import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { from, Observable, switchMap } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninResponseInterface } from '../interface/signin-response.interface';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Observable<void> {
    return this._userRepository.createUser(authCredentialsDto);
  }

  signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Observable<SigninResponseInterface> {
    const { username, password } = authCredentialsDto;
    const foundUser$ = from(this._userRepository.findOneBy({ username }));

    return foundUser$.pipe(
      switchMap(async (foundUser) => {
        if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
          const payLoad: JwtPayloadInterface = { username };
          const response: SigninResponseInterface = {
            accessToken: this._jwtService.sign(payLoad),
          };
          return response;
        } else {
          throw new UnauthorizedException(`Invalid credentials`);
        }
      }),
    );
  }
}
