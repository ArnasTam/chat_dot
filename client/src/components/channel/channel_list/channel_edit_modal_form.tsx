import React, { useEffect, useState } from "react";
import {
  Button,
  FormElement,
  Input,
  Modal,
  Progress,
  Text,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateChannelAction } from "../../../store/single_server_slice";
import { useParams } from "react-router-dom";
import { RootState } from "../../../store/store";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export default function ChannelEditModalForm(props: {
  id: string;
  name: string;
  onClose: Function;
}) {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [name, setName] = useState(props.name);
  const [nameError, setNameError] = useState(false);
  const [newRequest, setNewRequest] = useState(false);
  const state = useAppSelector((state: RootState) => state.singleServer);

  const handleNameChange = (event: React.ChangeEvent<FormElement>) => {
    setName(event.target.value);

    if (event.target.value.length < 5 || event.target.value.length > 80) {
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
          Edit Channel
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
          labelLeft="Title"
          aria-label={"title"}
          onChange={handleNameChange}
          value={name}
        />
        {nameError && (
          <Text size={"12px"} color={"red"}>
            Title must be between 5-80 characters in length
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
            disabled={nameError || name.length === 0}
            onClick={() => {
              dispatch(
                updateChannelAction({
                  id: props.id,
                  name: name,
                  serverId: params.serverId as string,
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
