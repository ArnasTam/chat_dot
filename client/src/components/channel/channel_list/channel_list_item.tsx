import React, { useState } from "react";
import { Channel } from "../../../types/channel";
import { Button, Card, Grid, Loading, Modal, Text } from "@nextui-org/react";
import { GrFormNext } from "react-icons/gr";
import { Box } from "../../misc/box/box";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { BsTrashFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { deleteChannelAction } from "../../../store/single_server_slice";
import ChannelEditModalForm from "./channel_edit_modal_form";
import { clear } from "../../../store/single_channel_slice";
import { getRole, getUserId, Role } from "../../../store/auth_slice";

export default function ChannelListItem(props: { channel: Channel }) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const channelsState = useAppSelector(
    (state: RootState) => state.singleServer
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const userRole = getRole();

  const hasPermission = () => {
    if (userRole === Role.SuperAdmin) return true;
    if (userRole === Role.ServerAdmin) {
      if (channelsState.server?.adminId === getUserId()) return true;
    }

    return false;
  };

  return (
    <Card css={{ w: "100%", mt: "20px", p: "20px" }}>
      <Grid.Container
        justify="space-between"
        onClick={() => {
          dispatch(clear());
          navigate(
            `/server/${params.serverId as string}/channel/${props.channel.id}`
          );
        }}
      >
        <Grid  css={{
          display: "flex",
          alignItems: "center",
          maxWidth: "50%",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "no-wrap"
         }}>
          <Box css={{ w: "5px" }} /> <Text b> Channel:</Text>{" "}
          <Box css={{ w: "5px" }} /> <Text> {props.channel.name}</Text>
        </Grid>

        <Grid css={{ display: "flex", alignItems: "center" }}>
          {hasPermission() && (
            <>
              <Button
                auto
                color="primary"
                bordered
                icon={<MdModeEditOutline size={"17px"} />}
                onClick={() => setEditModalVisible(true)}
              />
              <Box css={{ w: "10px" }} />
              {channelsState.deleteChannelState === "pending" ? (
                <Loading color={"error"} size={"md"} />
              ) : (
                <Button
                  auto
                  color="error"
                  bordered
                  icon={<BsTrashFill size={"17px"} />}
                  onClick={() =>
                    dispatch(
                      deleteChannelAction({
                        id: props.channel.id,
                        serverId: params.serverId as string,
                      })
                    )
                  }
                />
              )}
            </>
          )}
          <GrFormNext size="25px" />
        </Grid>
      </Grid.Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <ChannelEditModalForm
          id={props.channel.id}
          onClose={() => setEditModalVisible(false)}
          name={props.channel.name}
        />
      </Modal>
    </Card>
  );
}
