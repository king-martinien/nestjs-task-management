import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';
import { from, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: '@Secret24',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: JwtPayloadInterface) {
    const { username } = payload;
    const foundUser$ = from(this._userRepository.findOneBy({ username }));

    return foundUser$.pipe(
      map((foundUser) => {
        if (!foundUser) {
          throw new UnauthorizedException();
        }
        return foundUser;
      }),
    );
  }
}
