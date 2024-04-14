import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('T_USERS')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password' })
  password: string;
}
