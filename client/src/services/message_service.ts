import axios from "axios";
import { getJWT } from "../store/auth_slice";
import { apiUrl } from "../utils/constants";
import { Message } from "../types/message";

axios.defaults.headers.common["Authorization"] = "Bearer " + getJWT();

export const getChannelMessages = async (props: {
  serverId: string;
  channelId: string;
}): Promise<Message[]> => {
  const response = await axios.get(
    `${apiUrl}/servers/${props.serverId}/channels/${props.channelId}/messages`
  );

  return response.data.map((message: any) => {
    return {
      id: message.id,
      content: message.content,
      channelId: message.channelId,
      authorId: message.authorId,
      dateUpdated: message.dateUpdated,
      dateCreated: message.dateCreated,
    } as Message;
  });
};

export const getMessageById = async (props: {
  id: string;
  serverId: string;
  channelId: string;
}): Promise<Message> => {
  const response = await axios.get(
    `${apiUrl}/servers/${props.serverId}/channels/${props.channelId}/messages/${props.id}`
  );

  return {
    id: response.data.id,
    content: response.data.content,
    channelId: response.data.channelId,
    authorId: response.data.authorId,
    dateUpdated: response.data.dateUpdated,
    dateCreated: response.data.dateCreated,
  } as Message;
};

export const addMessage = async (props: {
  content: string;
  serverId: string;
  channelId: string;
}): Promise<void> => {
  const response = await axios.post(
    `${apiUrl}/servers/${props.serverId}/channels/${props.channelId}/messages`,
    {
      content: props.content,
    }
  );

  return response.data;
};

export const updateMessage = async (props: {
  id: string;
  content: string;
  serverId: string;
  channelId: string;
}): Promise<void> => {
  const response = await axios.put(
    `${apiUrl}/servers/${props.serverId}/channels/${props.channelId}/messages/${props.id}`,
    {
      content: props.content,
    }
  );

  return response.data;
};

export const deleteMessage = async (props: {
  id: string;
  serverId: string;
  channelId: string;
}): Promise<void> => {
  const response = await axios.delete(
    `${apiUrl}/servers/${props.serverId}/channels/${props.channelId}/messages/${props.id}`
  );

  return response.data;
};
