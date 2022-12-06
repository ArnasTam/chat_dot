import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { Server } from './server';
import { Message } from './message';
import { User } from './user';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 80,
  })
  @Length(5, 80)
  name: string;

  @ManyToOne(() => Server, (server) => server.channels, {
    eager: true,
    onDelete: 'CASCADE',
  })
  server: Server;

  @OneToMany(() => Message, (message) => message.channel, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  messages: Message[];

  @ManyToOne(() => User, (user) => user.channels, {
    eager: true,
  })
  creator: User;
}

export const channelSchema = {
  name: { type: "string", required: true, example: "name" },
  serverId: { type: "uuid", required: true },
};

export const serverChannelSchema = {
  name: { type: "string", required: true, example: "name" },
};


