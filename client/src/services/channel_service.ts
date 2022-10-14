import axios from "axios";
import { getJWT } from "../store/auth_slice";
import { Channel } from "../types/channel";

axios.defaults.headers.common["Authorization"] = "Bearer " + getJWT();

export const getServerChannels = async (props: {
  serverId: string;
}): Promise<Channel[]> => {
  const response = await axios.get(
    `${"localhost:3000"}/servers/${props.serverId}/channels`
  );

  console.log("getServerChannels");

  return response.data.map((channel: any) => {
    return {
      id: channel.id,
      name: channel.name,
      serverId: channel.serverId,
    } as Channel;
  });
};
