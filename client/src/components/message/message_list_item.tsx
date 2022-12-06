import React, { useState } from "react";
import { Button, Card, Grid, Loading, Modal, Text } from "@nextui-org/react";
import { BsTrashFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Message } from "../../types/message";
import MessageEditModalForm from "./message_edit_modal_form";
import { deleteMessageAction } from "../../store/single_channel_slice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import { getRole, getUserId, Role } from "../../store/auth_slice";
import { Box } from "../misc/box/box";
import { clear } from "../../store/single_message_slice";

export default function MessageListItem(props: { message: Message }) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const channelsState = useAppSelector(
    (state: RootState) => state.singleServer
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const serverState = useAppSelector((state: RootState) => state.servers);
  const userRole = getRole();

  const hasPermission = () => {
    if (userRole === Role.SuperAdmin) return true;
    if (userRole === Role.ServerAdmin) {
      if (
        serverState.servers.filter(
          (s) => s.id == params.serverId && s.adminId === getUserId()
        ).length > 0
      )
        return true;
      if (props.message.authorId === getUserId()) {
        return true;
      }
    }
    if (userRole === Role.BasicUser) {
      if (props.message.authorId === getUserId()) {
        return true;
      }
    }

    return false;
  };

  const tileColor =
    getUserId() == props.message.authorId ? "#7828C8FF" : "white";

  return (
    <Card css={{ w: "100%", mt: "20px", p: "20px", borderColor: tileColor }}>
      <Grid.Container
        justify="space-between"
        onClick={() => {
          dispatch(clear());
          navigate(
            `/server/${params.serverId as string}/channel/${
              params.channelId as string
            }/messages/${props.message.id}`
          );
        }}
      >
        <Grid
          css={{
            maxWidth: "50%",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "no-wrap",
          }}
        >
          <Text> {props.message.content}</Text>
          <Text size="$xs" b css={{ color: "#909090" }}>
            From:
          </Text>
          <Box css={{ w: "5px" }} />
          <Text size="$xs" css={{ color: "#909090" }}>
            {props.message.authorId}
          </Text>
        </Grid>

        {hasPermission() && (
          <Grid css={{ display: "flex", alignItems: "center" }}>
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
                    deleteMessageAction({
                      id: props.message.id,
                      serverId: params.serverId as string,
                      channelId: params.channelId as string,
                    })
                  )
                }
              />
            )}
          </Grid>
        )}
      </Grid.Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <MessageEditModalForm
          id={props.message.id}
          onClose={() => setEditModalVisible(false)}
          content={props.message.content}
        />
      </Modal>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <MessageEditModalForm
          id={props.message.id}
          onClose={() => setEditModalVisible(false)}
          content={props.message.content}
        />
      </Modal>
    </Card>
  );
}
