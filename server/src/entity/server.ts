import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './user';
import { Channel } from './channel';

@Entity()
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 80,
  })
  @Length(5, 80)
  name: string;

  @Column({
    length: 300,
  })
  @Length(1, 300)
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.servers, { eager: true })
  admin: User;

  @OneToMany(() => Channel, (channel) => channel.server)
  @JoinTable()
  channels: Channel[];
}

export const serverSchema = {
  name: { type: 'string', required: true, example: 'name' },
  description: { type: 'string', required: true, example: 'description' },
};
