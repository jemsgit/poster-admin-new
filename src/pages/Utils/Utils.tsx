import { useState } from "react";
import { useLoaderApi } from "../../utils/router";
import {
  Channel as ChannelModel,
  ContentType,
  RourceItem,
} from "../../models/channel";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Switch,
  Select,
  Button,
  Typography,
  Flex,
} from "antd";
import { useUpdateChannelMutation } from "../../store/channels/api";
import styles from "./Channel.module.css";

const { Title, Text } = Typography;
const { Option } = Select;

const contentResources: RourceItem[] = [
  { title: "Main content", type: "main" },
  { title: "Draft", type: "draft" },
  { title: "Result", type: "result" },
  { title: "RSS List", type: "rss-list" },
  { title: "rss result", type: "rss-result" },
];

const Channel = () => {
  const { data: channel, isLoading, isError } = useLoaderApi<ChannelModel>();
  const navigate = useNavigate();
  const [updateChannel] = useUpdateChannelMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (type: ContentType) => {
    navigate(`/channels/content-edit/${channel?.username}/${type}`);
  };

  const handleSubmit = (values: any) => {
    if (channel) {
      updateChannel({
        channelInfo: {
          postingSettings: {
            ...channel.postingSettings,
            type: values.type,
            loadImage: values.loadImage,
            times: values.postingTimes,
          },
          graberSettings: channel.graberSettings
            ? {
                ...(channel.graberSettings || {}),
                times: values.graberTimes,
              }
            : undefined,
        },
        channelId: channel.username,
      });
    }
    setIsEditing(false);
  };

  const renderViewMode = () => (
    <>
      <Text strong>Username:</Text> <Text>{channel!.username}</Text>
      <br />
      <Text strong>Has Draft:</Text>{" "}
      <Text>{channel!.graberSettings?.hasDraft ? "Yes" : "No"}</Text>
      <br />
      <Text strong>Posting Type:</Text>{" "}
      <Text>{channel!.postingSettings.type}</Text>
      <br />
      <Text strong>Load Image:</Text>{" "}
      <Text>{channel!.postingSettings.loadImage.toString()}</Text>
      <br />
      <Text strong>Posting Times:</Text>{" "}
      <Text>{channel!.postingSettings.times.join(", ")}</Text>
      <br />
      <Text strong>Graber Times:</Text>{" "}
      <Text>{channel!.graberSettings?.times}</Text>
    </>
  );

  const renderEditMode = () => (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        hasDraft: channel!.graberSettings?.hasDraft,
        type: channel!.postingSettings.type,
        loadImage: channel!.postingSettings.loadImage,
        postingTimes: channel!.postingSettings.times,
        graberTimes: channel!.graberSettings?.times,
      }}
    >
      <Form.Item name="hasDraft" label="Has Draft" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="type" label="Posting Type">
        <Select>
          <Option value="links">Link</Option>
          <Option value="video">Video</Option>
        </Select>
      </Form.Item>
      <Form.Item name="loadImage" label="Load Image">
        <Select>
          <Option value={true}>True</Option>
          <Option value={false}>False</Option>
          <Option value="random">Random</Option>
        </Select>
      </Form.Item>
      <Form.Item name="postingTimes" label="Posting Times">
        <Input />
      </Form.Item>
      <Form.Item name="graberTimes" label="Graber Times">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <Card
      title={`Channel Info: ${channel.username}`}
      extra={
        <Switch
          checked={isEditing}
          onChange={(checked) => setIsEditing(checked)}
          checkedChildren="Edit"
          unCheckedChildren="View"
        />
      }
    >
      {isEditing ? renderEditMode() : renderViewMode()}
      <Title level={4}>Edit Content</Title>
      <Flex gap={12} wrap="wrap">
        {contentResources.map((item) => (
          <Card
            bordered
            className={styles.contentEditPlate}
            onClick={() => handleEdit(item.type)}
          >
            {item.title}
          </Card>
        ))}
      </Flex>
      <Title level={4}>Check Grabber</Title>
      <Button
        type="primary"
        onClick={() => navigate(`/grabbers/${channel.username}`)}
      >
        Grabber Info
      </Button>
    </Card>
  );
};

export default Channel;
