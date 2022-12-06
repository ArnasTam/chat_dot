import React, { useEffect, useState } from "react";
import NavBar from "../../components/misc/navbar/navbar";
import { Button, Card, Grid, Loading, Modal, Text } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import Spinner from "../../components/misc/spinner/spinner";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/misc/layout";
import { Box } from "../../components/misc/box/box";
import MessageEditModalForm from "../../components/message/message_edit_modal_form";
import { getMessageByIdAction } from "../../store/single_message_slice";
import { MdModeEditOutline } from "react-icons/md";
import { BsTrashFill } from "react-icons/bs";
import { clear, deleteMessageAction } from "../../store/single_channel_slice";
import ErrorScreen from "../../components/misc/error/error_screen";
import { getRole, getUserId, Role } from "../../store/auth_slice";

export default function SingleMessagePage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const channelState = useAppSelector(
    (state: RootState) => state.singleChannel
  );
  const serverState = useAppSelector((state: RootState) => state.servers);
  const messageState = useAppSelector(
    (state: RootState) => state.singleMessage
  );

  const [editModalVisible, setEditModalVisible] = useState(false);
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
      if (messageState.message?.authorId === getUserId()) {
        return true;
      }
    }
    if (userRole === Role.BasicUser) {
      if (messageState.message?.authorId === getUserId()) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (
      messageState.getMessageStatus === "idle" ||
      channelState.deleteChannelState === "succeeded" ||
      channelState.addChannelState === "succeeded" ||
      channelState.editChannelState === "succeeded" ||
      messageState.message?.id !== params.messageId
    ) {
      dispatch(
        getMessageByIdAction({
          serverId: params.serverId as string,
          channelId: params.channelId as string,
          id: params.messageId as string,
        })
      );
    }
  }, [
    channelState.addChannelState,
    channelState.deleteChannelState,
    channelState.editChannelState,
  ]);

  if (messageState.getMessageStatus === "failed") {
    return <ErrorScreen />;
  }

  if (
    (channelState.editChannelState !== "succeeded" &&
      channelState.deleteChannelState !== "succeeded" &&
      channelState.addChannelState !== "succeeded" &&
      messageState.getMessageStatus === "pending") ||
    messageState.message?.id !== params.messageId
  ) {
    return (
      <>
        <NavBar /> <Spinner />
      </>
    );
  }

  if (channelState.deleteChannelState === "succeeded") {
    dispatch(clear());
    navigate(
      `/server/${params.serverId as string}/channel/${
        params.channelId as string
      }`
    );

    return (
      <>
        <NavBar /> <Spinner />
      </>
    );
  }

  return (
    <Layout>
      <Grid.Container
        css={{
          pt: "10px",
          w: "100%",
          display: "flex",
          alignItems: "center",
        }}
        direction="column"
        justify="center"
      >
        <Card css={{ w: "90%", mt: "20px", p: "20px", margin: "10px" }}>
          <Grid.Container
            justify="space-between"
            css={{
              margin: "10px",
            }}
          >
            <Grid>
              <Text size="$md" b>
                Content:
              </Text>
              <Box css={{ w: "5px" }} />
              <Text size="$md">{messageState.message?.content}</Text>
              <Text size="$md" b>
                Author:
              </Text>
              <Box css={{ w: "5px" }} />
              <Text size="$md">{messageState.message?.authorId}</Text>
            </Grid>
          </Grid.Container>
          {hasPermission() && (
            <Grid css={{ display: "flex", alignItems: "center" }}>
              <Button
                css={{w:"100%"}}
                auto
                color="primary"
                bordered
                icon={<MdModeEditOutline size={"17px"} />}
                onClick={() => setEditModalVisible(true)}
              />
              <Box css={{ w: "10px" }} />
              {channelState.deleteChannelState === "pending" ? (
                <Loading color={"error"} size={"md"} />
              ) : (
                <Button
                  auto
                  css={{w:"100%"}}
                  color="error"
                  bordered
                  icon={<BsTrashFill size={"17px"} />}
                  onClick={() =>
                    dispatch(
                      deleteMessageAction({
                        id: messageState.message!.id,
                        serverId: params.serverId as string,
                        channelId: params.channelId as string,
                      })
                    )
                  }
                />
              )}
            </Grid>
          )}
          <Modal
            closeButton
            aria-labelledby="modal-title"
            open={editModalVisible}
            onClose={() => setEditModalVisible(false)}
          >
            <MessageEditModalForm
              id={messageState.message!.id}
              onClose={() => setEditModalVisible(false)}
              content={messageState.message!.content}
            />
          </Modal>
        </Card>
      </Grid.Container>
    </Layout>
  );
}
