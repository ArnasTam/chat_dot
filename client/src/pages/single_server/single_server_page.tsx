import React, { useEffect, useState } from "react";
import NavBar from "../../components/misc/navbar/navbar";
import { Button, Card, Grid, Modal, Text } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import Spinner from "../../components/misc/spinner/spinner";
import {
  clearDelete,
  getAllServerChannelsAction,
  getServerByIdAction,
} from "../../store/single_server_slice";
import { useParams } from "react-router-dom";
import ChannelList from "../../components/channel/channel_list/channel_list";
import ChannelAddModalForm from "../../components/channel/channel_list/channel_add_modal_form";
import Layout from "../../components/misc/layout";
import { Box } from "../../components/misc/box/box";
import ErrorScreen from "../../components/misc/error/error_screen";
import { useToast } from "@chakra-ui/react";
import { getRole, getUserId, Role } from "../../store/auth_slice";

export default function SingleServerPage() {
  const params = useParams();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const serverState = useAppSelector((state: RootState) => state.singleServer);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const userRole = getRole();

  const hasPermission = () => {
    if (userRole === Role.SuperAdmin) return true;
    if (userRole === Role.ServerAdmin) {
      if (serverState.server?.adminId === getUserId()) return true;
    }

    return false;
  };

  useEffect(() => {
    if (
      serverState.getServerStatus === "idle" ||
      serverState.deleteChannelState === "succeeded" ||
      serverState.addChannelState === "succeeded" ||
      serverState.editChannelState === "succeeded" ||
      serverState.server?.id !== params.serverId
    ) {
      console.log("cia");
      dispatch(getServerByIdAction({ serverId: params.serverId as string }));
      dispatch(
        getAllServerChannelsAction({ serverId: params.serverId as string })
      );
    }
  }, [
    serverState.addChannelState,
    serverState.deleteChannelState,
    serverState.editChannelState,
  ]);

  useEffect(() => {
    if (serverState.deleteChannelState === "failed") {
      toast({
        title: "Error",
        description: "An error occurred while performing this operation",
        status: "error",
        isClosable: true,
      });
      dispatch(clearDelete());
    }
  }, [serverState.deleteChannelState]);

  if (
    serverState.getChannelsState === "failed" ||
    serverState.getServerStatus === "failed"
  ) {
    return <ErrorScreen />;
  }

  if (
    (serverState.editChannelState !== "succeeded" &&
      serverState.deleteChannelState !== "succeeded" &&
      serverState.addChannelState !== "succeeded" &&
      serverState.getServerStatus === "pending") ||
    serverState.getServerStatus === "idle" ||
    serverState.server?.id !== params.serverId
  ) {
    return (
      <>
        <NavBar /> <Spinner />
      </>
    );
  }

  //TODO: Move modal logic
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
            <Grid css={{
              w: "100%",
            }}>
              <Text size="$md" b>
                Name:
              </Text>
              <Box css={{ w: "5px" }} />
              <Text size="$md">{serverState.server?.name}</Text>
              <Text size="$md" b>
                Description:
              </Text>
              <Box css={{ w: "5px" }} />
              <Box css={{ w: "auto" }}>
                <Text size="$md">{serverState.server?.description}</Text>
              </Box>
            </Grid>
          </Grid.Container>
        </Card>
        {hasPermission() && (
          <Grid>
            <Button
              color="gradient"
              auto
              shadow
              css={{ fontSize: "20px", height: "50px", w: "90vw" }}
              onClick={() => setAddModalVisible(true)}
            >
              Add New Channel
            </Button>
          </Grid>
        )}
        <ChannelList channels={serverState.channels} />
      </Grid.Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <ChannelAddModalForm onClose={() => setAddModalVisible(false)} />
      </Modal>
    </Layout>
  );
}
