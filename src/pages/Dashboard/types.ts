import { Bot } from "../../models/bot";
import { Channel } from "../../models/channel";
import { Grabber } from "../../models/grabber";

export interface DashboardData {
  bots: Bot[] | undefined;
  channels: Channel[] | undefined;
  grabbers: Grabber[] | undefined;
}
