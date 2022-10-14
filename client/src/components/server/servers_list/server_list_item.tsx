import React, { useState } from "react";
import { Server } from "../../../types/server";
import { Button, Card, Grid, Loading, Modal, Text } from "@nextui-org/react";
import { GrFormNext } from "react-icons/gr";
import { Box } from "../../misc/box/box";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { BsTrashFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { deleteServerAction } from "../../../store/server_slice";
import ServerEditModalForm from "./server_edit_modal_form";
import { useNavigate } from "react-router-dom";

export default function ServerListItem(props: { server: Server }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const serversState = useAppSelector((state: RootState) => state.servers);
  const [editModalVisible, setEditModalVisible] = useState(false);

  return (
    <Card css={{ w: "100%", mt: "20px", p: "20px" }}>
      <Grid.Container
        justify="space-between"
        onClick={() => navigate(`/server/${props.server.id}`)}
      >
        <Grid css={{ display: "flex", alignItems: "center" }}>
          <Box css={{ w: "5px" }} /> <Text b> Server:</Text>{" "}
          <Box css={{ w: "5px" }} /> <Text> {props.server.name}</Text>
        </Grid>

        <Grid css={{ display: "flex", alignItems: "center" }}>
          {serversState.deleteServerStatus === "pending" ? (
            <Loading color={"error"} size={"md"} />
          ) : (
            <Button
              auto
              color="error"
              bordered
              icon={<BsTrashFill size={"17px"} />}
              onClick={() =>
                dispatch(deleteServerAction({ id: props.server.id }))
              }
            />
          )}

          <Box css={{ w: "10px" }} />
          <Button
            auto
            color="primary"
            bordered
            icon={<MdModeEditOutline size={"17px"} />}
            onClick={() => setEditModalVisible(true)}
          />
          <GrFormNext size="25px" />
        </Grid>
      </Grid.Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <ServerEditModalForm
          id={props.server.id}
          onClose={() => setEditModalVisible(false)}
          name={props.server.name}
          description={props.server.description}
        />
      </Modal>
    </Card>
  );
}
