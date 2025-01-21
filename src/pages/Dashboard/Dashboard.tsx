import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { DashboardData } from "./types";
import { useLoaderApi } from "../../utils/router";
import DasboardListItem from "../../components/DasboardListItem/DasboardListItem";
import InlineList from "../../components/InlineList/InlineList";
import { Bot } from "../../models/bot";
import { Channel } from "../../models/channel";
import { Grabber } from "../../models/grabber";

const { Title } = Typography;

const mapChannelToContent = (channel: Channel): string => {
  const {
    postingSettings: { times, type, loadImage },
    graberSettings,
  } = channel;

  let grabberInfo = "";
  let hasDraft = false;
  if (graberSettings) {
    const { times, modulePath, hasDraft: hasDraftGrabber } = graberSettings;
    hasDraft = hasDraftGrabber;
    grabberInfo = `
Grabber:
Time: ${times},
Module: ${modulePath}`;
  }
  return `Has draft: ${hasDraft ? "Yes" : "No"}

Posting:
Time: ${times},
Type: ${type}
loadImage: ${loadImage}
${grabberInfo}`;
};

const mapBotsToContent = (bot: Bot): string => {
  const { username } = bot;
  return `${username}`;
};

const mapGrabbersToContent = (grabber: Grabber): string => {
  const { channel, filesList } = grabber;
  return `Channel: ${channel}
Files: ${filesList.length}`;
};

function Dashboard() {
  const { data, isError, isLoading } = useLoaderApi<DashboardData>();
  const navigate = useNavigate();

  const handleChannelClick = (channelId: string) => {
    navigate(`/channels/${channelId}`);
  };

  const handleBotClick = (botId: string) => {
    navigate(`/bots/${botId}`);
  };

  const handleGrabberClick = (grabberId: string) => {
    navigate(`/grabbers/${grabberId}`);
  };

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title>Dashboard</Title>

      <Title level={4} type="secondary">
        Channels
      </Title>
      <InlineList>
        {data.channels?.map((channel: Channel) => (
          <DasboardListItem
            title={channel.username}
            key={channel.username}
            content={mapChannelToContent(channel)}
            onClick={() => handleChannelClick(channel.username)}
          />
        ))}
      </InlineList>

      <Title level={4} type="secondary">
        Bots
      </Title>
      <InlineList>
        {data?.bots?.map((bot: Bot) => (
          <DasboardListItem
            title={bot.username}
            key={bot.username}
            content={mapBotsToContent(bot)}
            onClick={() => handleBotClick(bot.username)}
          />
        ))}
      </InlineList>

      <Title level={4} type="secondary">
        Grabbers
      </Title>
      <InlineList>
        {data?.grabbers?.map((grabber) => (
          <DasboardListItem
            title={grabber.name}
            key={grabber.name}
            content={mapGrabbersToContent(grabber)}
            onClick={() => handleGrabberClick(grabber.name)}
          />
        ))}
      </InlineList>
    </div>
  );
}

export default Dashboard;
