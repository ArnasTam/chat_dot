import { Channel } from "../entity/channel";

export default class ChannelMapper {
  public static mapToChannelResponseDTO = function(channel: Channel) {
    return {
      id: channel.id,
      name: channel.name,
      createdById: channel.creator?.id,
      serverId: channel.server.id,
    };
  };
}