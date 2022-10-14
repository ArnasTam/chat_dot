import React from "react";
import { Box } from "../../components/misc/box/box";
import NavBar from "../../components/misc/navbar/navbar";
import { GrKeyboard } from "react-icons/gr";
import { Grid, Text } from "@nextui-org/react";

export default function HomePage() {
  return (
    <Box>
      <NavBar />
      <Grid.Container
        css={{
          p: "30px",
          w: "100%",
          h: "80vh",
          display: "flex",
          alignItems: "center",
        }}
        direction="column"
        justify="center"
      >
        <GrKeyboard size="70px" />
        <Text size="20px" color="inherit" css={{ textAlign: "center" }}>
          Go to servers page to start chatting
        </Text>
      </Grid.Container>
    </Box>
  );
}
