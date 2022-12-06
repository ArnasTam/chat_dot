import React from "react";
import { Grid, Image } from "@nextui-org/react";
import Layout from "../../components/misc/layout";

export default function HomePage() {
  return (
    <Layout>
      <Grid.Container
        css={{
          p: "30px",
          w: "100%",
          display: "flex",
          alignItems: "center",
        }}
        direction="column"
        justify="center"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <Image
          css={{ maxW: "600px" }}
          src="https://previews.123rf.com/images/stockgiu/stockgiu1905/stockgiu190510814/122065842-millennial-smartphone-chat-conversation-young-people-talking-app-text-bubbles-black-and-white-vector.jpg"
        />
      </Grid.Container>
    </Layout>
  );
}
