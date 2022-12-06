import React, { useEffect, useRef } from "react";
import { Box } from "../../components/misc/box/box";
import NavBar from "../../components/misc/navbar/navbar";
import { Grid, Text } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import Spinner from "../../components/misc/spinner/spinner";
import { useParams } from "react-router-dom";
import MessageList from "../../components/message/message_list";
import {
  clearDelete,
  clearPost,
  getAllChannelMessagesByIdAction,
  getChannelByIdAction,
} from "../../store/single_channel_slice";
import MessageAddModalForm from "../../components/message/message_add_modal_form";
import Layout from "../../components/misc/layout";
import ErrorScreen from "../../components/misc/error/error_screen";
import { useToast } from "@chakra-ui/react";

export default function SingleChannelPage() {
  const params = useParams();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const channelState = useAppSelector(
    (state: RootState) => state.singleChannel
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (
      channelState.addChannelState === "failed" ||
      channelState.deleteChannelState === "failed"
    ) {
      toast({
        title: "Error",
        description: "An error occurred while performing this operation",
        status: "error",
        isClosable: true,
      });
      dispatch(clearPost());
      dispatch(clearDelete());
    }
  }, [channelState.addChannelState, channelState.deleteChannelState]);

  useEffect(() => {
    if (
      channelState.getServerStatus === "idle" ||
      channelState.deleteChannelState === "succeeded" ||
      channelState.addChannelState === "succeeded" ||
      channelState.editChannelState === "succeeded" ||
      channelState.channel?.id !== params.channelId ||
      channelState.channel === null
    ) {
      dispatch(
        getChannelByIdAction({
          serverId: params.serverId as string,
          id: params.channelId as string,
        })
      );
      dispatch(
        getAllChannelMessagesByIdAction({
          serverId: params.serverId as string,
          channelId: params.channelId as string,
        })
      );
    }
  }, [
    channelState.addChannelState,
    channelState.deleteChannelState,
    channelState.editChannelState,
  ]);

  if (
    channelState.getChannelsState === "failed" ||
    channelState.getServerStatus === "failed"
  ) {
    return <ErrorScreen />;
  }

  if (
    (channelState.editChannelState !== "succeeded" &&
      channelState.deleteChannelState !== "succeeded" &&
      channelState.addChannelState !== "succeeded" &&
      channelState.getServerStatus === "pending") ||
    channelState.getServerStatus === "idle" ||
    channelState.channel?.id !== params.channelId ||
    channelState.channel === null
  ) {
    return (
      <>
        <NavBar /> <Spinner />
      </>
    );
  } else {
    setTimeout(scrollToBottom, 500);
  }

  //TODO: Move modal logic
  return (
    <>
      <Layout>
        <Grid.Container
          css={{
            pb: "130px",
            w: "100%",
            display: "flex",
            alignItems: "center",
          }}
          direction="column"
          justify="center"
        >
          <MessageList messages={channelState.messages} />
        </Grid.Container>
        <Grid
          css={{
            backgroundColor: "white",
            position: "fixed",
            bottom: "65px",
            marginRight: "auto",
            marginLeft: "auto",
            left: "0px",
            right: "0px",
          }}
        >
          <Grid.Container
            justify="center"
            css={{
              paddingTop: "15px",
              borderTop: "lightgrey 1px solid",
            }}
          >
            <Grid>
              <Grid css={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Grid
                  css={{
                    w: "200px",
                  }}
                >
                  <Text size="$md" b css={{ color: "#909090" }}>
                    Channel Name:
                  </Text>
                  <Box css={{ w: "5px" }} />
                  <Text size="$md" css={{ color: "#909090" }}>
                    {channelState.channel?.name}
                  </Text>
                </Grid>
              </Grid>
            </Grid>
          </Grid.Container>
          <MessageAddModalForm onClose={() => {}} />
        </Grid>
      </Layout>
      <div ref={messagesEndRef} />
    </>
  );
}
