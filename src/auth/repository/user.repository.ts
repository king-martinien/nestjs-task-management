import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    _userRepository: Repository<UserEntity>,
  ) {
    super(
      _userRepository.target,
      _userRepository.manager,
      _userRepository.queryRunner,
    );
  }

  createUser(authCredentials: AuthCredentialsDto): Observable<void> {
    const { username, password } = authCredentials;
    const generatedSalt$ = from(bcrypt.genSalt());
    const hashedPassword$ = generatedSalt$.pipe(
      switchMap((generatedSalt) => {
        return bcrypt.hash(password, generatedSalt);
      }),
    );
    const newUser$ = hashedPassword$.pipe(
      map((hashedPassword) => {
        return this.create({ username, password: hashedPassword });
      }),
    );

    const createdUser$ = newUser$.pipe(
      switchMap((newUser) => {
        return this.save(newUser);
      }),
      catchError((err) => {
        if (err.code === '23505') {
          throw new ConflictException(`Username already exit`);
        } else {
          throw new InternalServerErrorException();
        }
      }),
    );
    return createdUser$.pipe(map(() => {}));
  }
}
