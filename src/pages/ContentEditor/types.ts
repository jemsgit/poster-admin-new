import { Channel, ContentCopyTarget } from "../../models/channel";

export interface ContentEditData {
  channel: Channel | undefined;
  targetsToCopy: ContentCopyTarget[];
  content: string | undefined;
}
