import React from "react";
import { Grid } from "@nextui-org/react";
import { Channel } from "../../../types/channel";
import ChannelListItem from "./channel_list_item";

export default function ChannelList(props: { channels: Channel[] }) {
  return (
    <Grid.Container css={{ w: "90%" }}>
      {props.channels.map((channel) => (
        <ChannelListItem key={channel.id} channel={channel} />
      ))}
    </Grid.Container>
  );
}
