import React, { useState } from "react";
import { Button, FormElement, Grid, Input, Text } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { addMessageAction } from "../../store/single_channel_slice";
import { useAppDispatch } from "../../hooks/hooks";
import { Alert, GridItem } from "@chakra-ui/react";

export default function MessageAddModalForm(props: { onClose: Function }) {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [nameError, setNameError] = useState(false);

  const [content, setContent] = useState("");

  const handleNameChange = (event: React.ChangeEvent<FormElement>) => {
    setContent(event.target.value);

    if (event.target.value.length < 1 || event.target.value.length > 200) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  return (
    <>
      <Grid css={{ display: "flex", alignItems: "center", padding: "20px" }}>
        <GridItem css={{ width: "100%" }}>
          <Input
            labelLeft="Content"
            aria-label={"content"}
            onChange={handleNameChange}
            css={{ w: "100%" }}
          />
        </GridItem>
        <Button
          css={{ w: "20%" }}
          auto
          disabled={nameError || content.length === 0}
          color="gradient"
          onClick={() => {
            dispatch(
              addMessageAction({
                content: content,
                serverId: params.serverId as string,
                channelId: params.channelId as string,
              })
            );
            props.onClose();
          }}
        >
          Send
        </Button>
      </Grid>
      <Grid css={{ display: "flex", alignItems: "center", paddingLeft: "20px", paddingBottom: "20px"  }}>
        {nameError && (
          <Text size={"12px"} color={"red"}>
            Content must be between 1-200 characters in length
          </Text>
        )}
      </Grid>
    </>
  );
}
