import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {IsEmail, Length} from "class-validator";
import {Role} from "./role";
import {Server} from "./server";
import { Message } from "./message";
import { Channel } from './channel'
import { channel } from '../controller'

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        length: 100
    })
    @Length(10, 100)
    @IsEmail()
    email: string;

    @Column({
        length: 80
    })
    @Length(5, 80)
    userName: string;

    @Column({
        length: 80
    })
    @Length(5, 80)
    password: string;

    @Column('int')
    role: Role;

    @OneToMany(() => Server, (server) => server.admin)
    @JoinTable()
    servers: Server[]

    @OneToMany(() => Channel, (channel) => channel.creator)
    @JoinTable()
    channels: Channel[]

    @OneToMany(() => Message, (message) => message.author)
    @JoinTable()
    messages: Message[]
}

export const userSchema = {
    userName: {type: "string", required: true, example: "username"},
    password: {type: "string", required: true, example: "password"},
    email: {
        type: "string",
        required: true,
        example: "email@gmail.com"
    },
    role: {type: "number", required: true, example: 2},
};