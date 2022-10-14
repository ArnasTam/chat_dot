import React from "react";
import { Grid } from "@nextui-org/react";
import { Channel } from "../../../types/channel";

export default function ChannelList(props: { channels: Channel[] }) {
  return (
    <Grid.Container css={{ w: "90%" }}>
      {props.channels.map((channel) => channel.name)}
    </Grid.Container>
  );
}
