import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useLoaderApi } from "../../utils/router";
import InlineList from "../../components/InlineList/InlineList";
import DasboardListItem from "../../components/DasboardListItem/DasboardListItem";
import { Channel } from "../../models/channel";

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
    grabberInfo = `\nGrabber:\nTime: ${times},\nModule: ${modulePath}`;
  }
  return `Has draft: ${
    hasDraft ? "Yes" : "No"
  }\n\nPosting:\nTime: ${times},\nType: ${type}\nloadImage: ${loadImage}\n${grabberInfo}`;
};

function Channels() {
  const { data, isError, isLoading } = useLoaderApi<{ channels: Channel[] }>();
  const navigate = useNavigate();

  const handleChannelClick = (channelId: string) => {
    navigate(`/channels/${channelId}`);
  };

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title>Channels</Title>
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
    </div>
  );
}

export default Channels;
