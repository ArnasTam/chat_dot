export interface Message {
  id: string;
  content: string;
  dateCreated: Date;
  dateUpdated: Date;
  channelId: string;
  authorId: string;
}