import React from "react";
import { Grid } from "@nextui-org/react";
import { Message } from '../../types/message'
import MessageListItem from './message_list_item'

export default function MessageList(props: { messages: Message[] }) {
  return (
    <Grid.Container css={{ w: "90%" }}>
      {props.messages.map((message) => (
        <MessageListItem key={message.id} message={message} />
      ))}
    </Grid.Container>
  );
}
