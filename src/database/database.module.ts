import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../tasks/entity/task.entity';
import { UserEntity } from '../auth/entity/user.entity';
import { validationSchema } from '../../schema/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.env.${process.env.STAGE}`],
      validationSchema: validationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (_configService: ConfigService) => ({
        type: 'postgres',
        host: _configService.get<string>('PG_HOST'),
        port: _configService.get<number>('PG_PORT'),
        username: _configService.get<string>('PG_USERNAME'),
        password: _configService.get<string>('PG_PASSWORD'),
        database: _configService.get<string>('PG_DATABASE'),
        entities: [TaskEntity, UserEntity],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
