import { Typography } from "antd";
import React, { Suspense } from "react";
import { Await, useNavigate, useNavigation } from "react-router-dom";
import { RouterLoader } from "../../routes/routes.types";
import { DashboardData } from "./types";
import { useLoaderApi, useLoaderData } from "../../utils/router";
import DasboardListItem from "../../components/DasboardListItem/DasboardListItem";
import InlineList from "../../components/InlineList/InlineList";
import { Bot } from "../../models/bot";
import { Channel } from "../../models/channel";

const { Title } = Typography;

interface Props {}

function Dashboard(props: Props) {
  const {} = props;
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
        {data?.channels?.map((channel: Channel) => (
          <DasboardListItem
            title={channel.username}
            key={channel.username}
            content={JSON.stringify(channel)}
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
            title={bot.name}
            key={bot.name}
            content={JSON.stringify(bot)}
            onClick={() => handleBotClick(bot.name)}
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
            content={JSON.stringify(grabber)}
            onClick={() => handleGrabberClick(grabber.name)}
          />
        ))}
      </InlineList>
    </div>
  );
}

export default Dashboard;
