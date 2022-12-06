import axios from "axios";
import { getJWT } from "../store/auth_slice";
import { Channel } from "../types/channel";
import { apiUrl } from "../utils/constants";

axios.defaults.headers.common["Authorization"] = "Bearer " + getJWT();

export const getServerChannels = async (props: {
  serverId: string;
}): Promise<Channel[]> => {
  const response = await axios.get(
    `${apiUrl}/servers/${props.serverId}/channels`
  );

  return response.data.map((channel: any) => {
    return {
      id: channel.id,
      name: channel.name,
      serverId: channel.serverId,
    } as Channel;
  });
};

export const getChannelById = async (props: {
  id: string;
  serverId: string;
}): Promise<Channel> => {
  const response = await axios.get(
    `${apiUrl}/servers/${props.serverId}/channels/${props.id}`
  );

  return {
    id: response.data.id,
    name: response.data.name,
    serverId: response.data.serverId,
  } as Channel;
};

export const addChannel = async (props: {
  name: string;
  serverId: string;
}): Promise<void> => {
  const response = await axios.post(
    `${apiUrl}/servers/${props.serverId}/channels`,
    {
      name: props.name,
    }
  );

  return response.data;
};

export const updateChannel = async (props: {
  id: string;
  name: string;
  serverId: string;
}): Promise<void> => {
  const response = await axios.put(
    `${apiUrl}/servers/${props.serverId}/channels/${props.id}`,
    {
      name: props.name,
    }
  );

  return response.data;
};

export const deleteChannel = async (props: {
  id: string;
  serverId: string;
}): Promise<void> => {
  const response = await axios.delete(
    `${apiUrl}/servers/${props.serverId}/channels/${props.id}`
  );

  return response.data;
};
