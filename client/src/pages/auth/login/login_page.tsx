import React from "react";
import LoginForm from "../../../components/auth/login_form/login_form";
import { Grid } from "@nextui-org/react";

export default function LoginPage() {
  return (
    <Grid.Container
      css={{
        h: "100vh",
        w: "100vw",
        backgroundColor: "gradient"
      }}
      justify="center"
      alignItems="center"
    >
      <Grid
        css={{
          w: "90%",
          maxW: "600px",
        }}
      >
        <LoginForm />
      </Grid>
    </Grid.Container>
  );
}
