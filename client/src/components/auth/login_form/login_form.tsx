import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  FormElement,
  Grid,
  Input,
  Loading,
  Text,
} from "@nextui-org/react";
import { RootState } from "../../../store/store";
import { login } from "../../../store/auth_slice";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { GrChatOption } from "react-icons/gr";

export default function LoginForm() {
  const loginStatus = useAppSelector((state: RootState) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loginStatus === "succeeded") {
      navigate("/home");
    }
    if (loginStatus === "failed") {
      toast({
        title: "Error",
        description: "You have entered an invalid username or password",
        status: "error",
        isClosable: true,
      });
    }
  }, [loginStatus, navigate, toast]);

  const handleUsernameChange = (event: React.ChangeEvent<FormElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<FormElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Card css={{ p: "10px", pb: "35px" }}>
      <Grid.Container direction="column" justify="center" gap={2}>
        <Grid.Container css={{ p: "20px" }} direction="row" justify="center">
          <GrChatOption size="30px" />
          <Text size="30px" b color="inherit">
            Chat.
          </Text>
        </Grid.Container>
        <Grid>
          <Input
            css={inputCSS}
            labelLeft="username"
            aria-label={"username"}
            onChange={handleUsernameChange}
          />
        </Grid>
        <Grid>
          <Input
            css={inputCSS}
            type="password"
            labelLeft="password"
            aria-label={"password"}
            onChange={handlePasswordChange}
          />
        </Grid>
        <Grid>
          <Button
            css={inputCSS}
            color="gradient"
            shadow
            auto
            onClick={() =>
              dispatch(login({ userName: username, password: password }))
            }
          >
            {loginStatus === "pending" ? (
              <Loading color="currentColor" size="sm" />
            ) : (
              "LOGIN"
            )}
          </Button>
        </Grid>
      </Grid.Container>
    </Card>
  );
}

const inputCSS = {
  w: "100%",
  fontWeight: "bold",
};
