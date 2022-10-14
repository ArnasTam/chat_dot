import React, { useEffect, useState } from "react";
import { Box } from "../../components/misc/box/box";
import NavBar from "../../components/misc/navbar/navbar";
import { Button, Grid, Modal } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import Spinner from "../../components/misc/spinner/spinner";
import {
  getAllServerChannelsAction,
  getServerByIdAction,
} from "../../store/single_server_slice";
import { useParams } from "react-router-dom";
import ChannelList from "../../components/channel/channel_list/channel_list";

export default function SingleServerPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const serverState = useAppSelector((state: RootState) => state.singleServer);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    if (
      (serverState.getServerStatus === "idle" &&
        typeof params.serverId === "string") ||
      serverState.server?.id !== params.serverId
    ) {
      console.log("useEffect");
      dispatch(getServerByIdAction({ serverId: params.serverId as string }));
      dispatch(
        getAllServerChannelsAction({ serverId: params.serverId as string })
      );
    }
  }, []);

  if (
    serverState.getServerStatus === "pending" ||
    serverState.getServerStatus === "idle"
  ) {
    return (
      <>
        <NavBar /> <Spinner />
      </>
    );
  }

  //TODO: Move modal logic
  return (
    <Box>
      <NavBar />
      <Grid.Container
        css={{
          pt: "20px",
          w: "100%",
          display: "flex",
          alignItems: "center",
        }}
        direction="column"
        justify="center"
      >
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
        <ChannelList channels={serverState.channels} />
      </Grid.Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        test
      </Modal>
    </Box>
  );
}
