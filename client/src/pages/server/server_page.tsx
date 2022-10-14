import React, { useEffect, useState } from "react";
import { Box } from "../../components/misc/box/box";
import NavBar from "../../components/misc/navbar/navbar";
import { Button, Grid, Modal } from "@nextui-org/react";
import ServersList from "../../components/server/servers_list/servers_list";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import { getServers } from "../../store/server_slice";
import Spinner from "../../components/misc/spinner/spinner";
import ServerAddModalForm from "../../components/server/servers_list/server_add_modal_form";

export default function ServerPage() {
  const dispatch = useAppDispatch();
  const serversState = useAppSelector((state: RootState) => state.servers);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    if (
      serversState.deleteServerStatus === "succeeded" ||
      serversState.addStatus === "succeeded" ||
      serversState.updateStatus === "succeeded" ||
      serversState.getAllStatus === "idle"
    ) {
      dispatch(getServers());
    }
  }, [
    serversState.addStatus,
    serversState.deleteServerStatus,
    serversState.updateStatus,
  ]);

  if (
    (serversState.updateStatus !== "succeeded" &&
      serversState.deleteServerStatus !== "succeeded" &&
      serversState.addStatus !== "succeeded" &&
      serversState.getAllStatus === "pending") ||
    serversState.getAllStatus === "idle"
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
            Add New Server
          </Button>
        </Grid>

        <ServersList servers={serversState.servers} />
      </Grid.Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <ServerAddModalForm onClose={() => setAddModalVisible(false)} />
      </Modal>
    </Box>
  );
}
