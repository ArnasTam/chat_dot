import {
  body,
  path,
  request,
  responsesAll,
  summary,
  tagsAll
} from "koa-swagger-decorator";
import { Context } from "koa";
import { getManager, Repository } from "typeorm";
import { validate, ValidationError } from "class-validator";
import { Message, messageSchema } from "../entity/message";
import { User } from "../entity/user";
import MessageMapper from "../mappers/message_mapper";
import { Channel } from "../entity/channel";

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['Message'])
export default class MessageController {
  @request('get', '/messages')
  @summary('Get all message')
  public static async getMessages(ctx: Context): Promise<void> {
    const messageRepository: Repository<Message> = getManager().getRepository(Message);

    const messages: Message[] = await messageRepository.find();

    ctx.status = 200;
    ctx.body = messages.map((message) => MessageMapper.mapToMessageResponseDTO(message));
  }

  @request('get', '/messages/{id}')
  @summary('Get message by id')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async getMessage(ctx: Context): Promise<void> {
    const messageRepository: Repository<Message> = getManager().getRepository(Message);

    const message: Message | undefined = await messageRepository.findOne(ctx.params.id);

    if (message) {
      ctx.status = 200;
      ctx.body = MessageMapper.mapToMessageResponseDTO(message);
    } else {
      ctx.status = 400;
      ctx.body = "The message you are trying to retrieve doesn't exist in the db";
    }
  }

  @request('post', '/messages')
  @summary('Create a message')
  @body(messageSchema)
  public static async createMessage(ctx: Context): Promise<void> {
    const messageRepository: Repository<Message> = getManager().getRepository(Message);
    const userRepository: Repository<User> = getManager().getRepository(User);
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const author = await userRepository.findOne({ id: ctx.request.body.authorId });
    const channel = await channelRepository.findOne({ id: ctx.request.body.channelId });

    const messageToBeSaved: Message = new Message();
    messageToBeSaved.content = ctx.request.body.content;
    messageToBeSaved.dateCreated = new Date();
    messageToBeSaved.author = author;
    messageToBeSaved.channel = channel;

    const errors: ValidationError[] = await validate(messageToBeSaved);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!author) {
      ctx.status = 400;
      ctx.body = "Author with the specified id does not exist";
    } else if (!channel) {
      ctx.status = 400;
      ctx.body = "Channel with the specified id does not exist";
    } else {
      const message = await messageRepository.save(messageToBeSaved);
      ctx.status = 201;
      ctx.body = MessageMapper.mapToMessageResponseDTO(message);
    }
  }

  @request('put', '/messages/{id}')
  @summary('Update a message')
  @path({
    id: { type: 'uuid', required: true },
  })
  @body(messageSchema)
  public static async updateMessage(ctx: Context): Promise<void> {
    const messageRepository: Repository<Message> = getManager().getRepository(Message);
    const userRepository: Repository<User> = getManager().getRepository(User);
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const author = await userRepository.findOne({ id: ctx.request.body.authorId });
    const channel = await channelRepository.findOne({ id: ctx.request.body.channelId });

    const messageToBeUpdated: Message = new Message();
    messageToBeUpdated.id = ctx.params.id;
    messageToBeUpdated.content = ctx.request.body.content;
    messageToBeUpdated.dateCreated = new Date();
    messageToBeUpdated.author = author;
    messageToBeUpdated.channel = channel;

    const errors: ValidationError[] = await validate(messageToBeUpdated);

    // TODO: check if user has permissions
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!author) {
      ctx.status = 400;
      ctx.body = "Author with the specified id does not exist";
    } else if (!channel) {
      ctx.status = 400;
      ctx.body = "Channel with the specified id does not exist";
    } else if (!(await messageRepository.findOne(messageToBeUpdated.id))) {
      ctx.status = 400;
      ctx.body = "The message you are trying to update doesn't exist in the db";
    } else {
      const message = await messageRepository.save(messageToBeUpdated);
      ctx.status = 201;
      ctx.body = MessageMapper.mapToMessageResponseDTO(message);
    }
  }

  @request('delete', '/messages/{id}')
  @summary('Delete message by id')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async deleteMessage(ctx: Context): Promise<void> {
    const messageRepository = getManager().getRepository(Message);

    const messageToRemove: Message | undefined = await messageRepository.findOne(ctx.params.id);

    // TODO: check if message is deleted by owner
    if (!messageToRemove) {
      ctx.status = 400;
      ctx.body = "The message you are trying to delete doesn't exist in the db";
    } else {
      await messageRepository.remove(messageToRemove);
      ctx.status = 204;
    }
  }
}
