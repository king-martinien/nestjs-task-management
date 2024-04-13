import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './tasks/entity/task.entity';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'king-martinien',
      password: 'postgres',
      database: 'task_management',
      entities: [TaskEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
