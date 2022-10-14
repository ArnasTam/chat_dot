import React from "react";
import { Grid, Loading } from "@nextui-org/react";
import { Box } from "../box/box";

export default function Spinner() {
  return (
    <Box>
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
        <Loading size="xl" color="secondary" />
      </Grid.Container>
    </Box>
  );
}
