import React from "react";
import { Server } from "../../../types/server";
import ServerListItem from "./server_list_item";
import { Grid } from "@nextui-org/react";

export default function ServersList(props: { servers: Server[] }) {
  return (
    <Grid.Container css={{ w: "90%" }}>
      {props.servers.map((server) => (
        <ServerListItem key={server.id} server={server} />
      ))}
    </Grid.Container>
  );
}
