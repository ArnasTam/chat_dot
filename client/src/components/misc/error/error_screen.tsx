import React from "react";

import { Grid, Text } from "@nextui-org/react";
import { GrStatusCritical } from "react-icons/gr";
import Layout from "../layout";

export default function ErrorScreen() {
  return (
    <Layout>
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
        <GrStatusCritical size="70px" />
        <Text size="20px" color="inherit" css={{ textAlign: "center" }}>
          An Error Occurred Loading This Content
        </Text>
      </Grid.Container>
    </Layout>
  );
}
