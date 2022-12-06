import { Message } from '../entity/message';

export default class MessageMapper {
  public static mapToMessageResponseDTO = function (message: Message) {
    return {
      id: message.id,
      content: message.content,
      dateCreated: message.dateCreated,
      dateUpdated: message.dateUpdated,
      channelId: message.channel.id,
      authorId: message.author.id,
    };
  };
}
