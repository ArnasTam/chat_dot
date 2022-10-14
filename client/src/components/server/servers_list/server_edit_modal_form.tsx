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
import { updateServerAction } from "../../../store/server_slice";

export default function ServerEditModalForm(props: {
  id: string;
  name: string;
  description: string;
  onClose: Function;
}) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);

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
          Edit Server
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          labelLeft="Title"
          aria-label={"title"}
          onChange={handleNameChange}
          value={name}
        />
        <Textarea
          value={description}
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
            dispatch(
              updateServerAction({
                id: props.id,
                name: name,
                description: description,
              })
            );
            props.onClose();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </>
  );
}
