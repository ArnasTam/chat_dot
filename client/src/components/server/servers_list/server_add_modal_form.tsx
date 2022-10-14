import React, { useState } from "react";
import {
  Button,
  FormElement,
  Input,
  Modal,
  Text,
  Textarea,
} from "@nextui-org/react";
import { useAppDispatch } from "../../../hooks/hooks";
import { addServerAction } from "../../../store/server_slice";

export default function ServerAddModalForm(props: { onClose: Function }) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleNameChange = (event: React.ChangeEvent<FormElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<FormElement>) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Modal.Header>
        <Text id="modal-title" b size={18}>
          Add New Server
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          labelLeft="Title"
          aria-label={"title"}
          onChange={handleNameChange}
        />
        <Textarea
          placeholder="Describe your server"
          rows={4}
          aria-label={"description"}
          onChange={handleDescriptionChange}
        />
      </Modal.Body>
      <Modal.Footer css={{ pb: "25px" }}>
        <Button
          css={{ w: "100%" }}
          auto
          ghost
          color="gradient"
          onClick={() => {
            dispatch(addServerAction({ name: name, description: description }));
            props.onClose();
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </>
  );
}
