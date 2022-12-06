import React, { ReactNode } from "react";
import { Box } from "./box/box";
import NavBar from "../../components/misc/navbar/navbar";
import { Grid, Text } from "@nextui-org/react";

import "../../index.css";

export default function Layout(props: { children?: ReactNode }) {
  return (
    <Box>
      <header className="header">
        <Grid.Container direction="column" justify="center" alignItems={"center"}>
          <Box css={{w: "200px"}}><p>Arnas Tamašauskas IFF-9/11</p></Box>
        </Grid.Container>
        <NavBar />
      </header>
      <main className={"main footerPadding headerPadding"}>
        {props.children}
      </main>
      <footer className="footer">
        <Grid.Container direction="column" justify="center" alignItems={"center"}>
          <Box css={{w: "200px"}}><p>Arnas Tamašauskas IFF-9/11</p></Box>
        </Grid.Container>
      </footer>
    </Box>
  );
}
