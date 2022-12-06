import React, { useEffect, useState } from "react";
import {
  Button,
  FormElement,
  Input,
  Modal,
  Progress,
  Text,
} from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { updateMessageAction } from "../../store/single_channel_slice";
import { RootState } from "../../store/store";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export default function MessageEditModalForm(props: {
  id: string;
  content: string;
  onClose: Function;
}) {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [newRequest, setNewRequest] = useState(false);
  const state = useAppSelector((state: RootState) => state.singleChannel);
  const [nameError, setNameError] = useState(false);

  const [content, setContent] = useState(props.content);

  const handleNameChange = (event: React.ChangeEvent<FormElement>) => {
    setContent(event.target.value);

    if (event.target.value.length < 1 || event.target.value.length > 200) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  useEffect(() => {
    if (state.editChannelState === "succeeded" && newRequest) {
      props.onClose();
    }
  }, [state.editChannelState, newRequest]);

  return (
    <>
      <Modal.Header>
        <Text id="modal-title" b size={18}>
          Edit Message
        </Text>
      </Modal.Header>
      <Modal.Body>
        {state.editChannelState === "failed" && newRequest && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>
              An error occurred while performing this operation
            </AlertDescription>
          </Alert>
        )}
        <Input
          labelLeft="Content"
          aria-label={"content"}
          onChange={handleNameChange}
          value={content}
        />
        {nameError && (
          <Text size={"12px"} color={"red"}>
            Content must be between 1-200 characters in length
          </Text>
        )}
      </Modal.Body>
      <Modal.Footer css={{ pb: "25px" }}>
        {state.editChannelState === "pending" ? (
          <Progress indeterminated value={50} color="gradient" />
        ) : (
          <Button
            css={{ w: "100%" }}
            auto
            ghost
            color="gradient"
            disabled={nameError || content.length === 0}
            onClick={() => {
              dispatch(
                updateMessageAction({
                  id: props.id,
                  content: content,
                  serverId: params.serverId as string,
                  channelId: params.channelId as string,
                })
              );
              setNewRequest(true);
            }}
          >
            Save
          </Button>
        )}
      </Modal.Footer>
    </>
  );
}
