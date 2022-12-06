import React, { useEffect, useState } from "react";
import {
  Button,
  FormElement,
  Input,
  Modal,
  Progress,
  Text,
  Textarea,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateServerAction } from "../../../store/server_slice";
import { RootState } from "../../../store/store";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export default function ServerEditModalForm(props: {
  id: string;
  name: string;
  description: string;
  onClose: Function;
}) {
  const dispatch = useAppDispatch();
  const serversState = useAppSelector((state: RootState) => state.servers);

  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [newRequest, setNewRequest] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<FormElement>) => {
    setName(event.target.value);

    if (event.target.value.length < 5 || event.target.value.length > 80) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<FormElement>) => {
    setDescription(event.target.value);

    if (event.target.value.length < 1 || event.target.value.length > 300) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }
  };

  useEffect(() => {
    if (serversState.updateStatus === "succeeded" && newRequest) {
      props.onClose();
    }
  }, [serversState.updateStatus, newRequest]);

  return (
    <>
      <Modal.Header>
        <Text id="modal-title" b size={18}>
          Edit Server
        </Text>
      </Modal.Header>
      <Modal.Body>
        {serversState.updateStatus === "failed" && newRequest && (
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
          placeholder={"5-80 characters"}
        />
        {nameError && (
          <Text size={"12px"} color={"red"}>
            Title must be between 5-80 characters in length
          </Text>
        )}
        <Textarea
          value={description}
          placeholder="Describe your server (1-300 characters long)"
          rows={4}
          aria-label={"description"}
          onChange={handleDescriptionChange}
        />
        {descriptionError && (
          <Text size={"12px"} color={"red"}>
            Description must be between 1-300 characters in length
          </Text>
        )}
      </Modal.Body>
      <Modal.Footer css={{ pb: "25px" }}>
        {serversState.updateStatus === "pending" ? (
          <Progress indeterminated value={50} color="gradient" />
        ) : (
          <Button
            css={{ w: "100%" }}
            auto
            ghost
            color="gradient"
            disabled={
              nameError ||
              descriptionError ||
              name.length === 0 ||
              description.length === 0
            }
            onClick={() => {
              dispatch(
                updateServerAction({
                  id: props.id,
                  name: name,
                  description: description,
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
