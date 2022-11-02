import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';
import { Channel } from './channel';
import { User } from './user';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 200,
  })
  @Length(1, 200)
  content: string;

  @Column({ type: 'timestamptz' })
  dateCreated: Date;

  @Column({ type: 'timestamptz' })
  dateUpdated: Date;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
    eager: true,
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  author: User;
}

export const messageSchema = {
  content: { type: 'string', required: true, example: 'content' },
  channelId: { type: 'uuid', required: true },
  authorId: { type: 'uuid', required: true },
};

export const channelMessageSchema = {
  content: { type: 'string', required: true, example: 'content' },
};