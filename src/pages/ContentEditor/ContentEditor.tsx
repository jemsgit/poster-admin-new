import React from "react";
import Editor from "../../components/Editor/Editor";
import { Typography } from "antd";
import { useLoaderApi } from "../../utils/router";
import { ContentEditData } from "./types";
import {
  useCopyContentMutation,
  useSaveContentMutation,
} from "../../store/channels/api";
import { useParams } from "react-router-dom";

const { Title } = Typography;
interface Props {}

function ContentEditor(props: Props) {
  const {} = props;
  const { data, isLoading, isError } = useLoaderApi<ContentEditData>();
  const { type } = useParams();
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();
  const [copyContent, { isLoading: isCopieng }] = useCopyContentMutation();

  const handleSaveContent = (content: string) => {
    if (!data || !data.channel || !type) {
      return;
    }
    saveContent({
      content,
      channelId: data.channel.username,
      type,
    });
  };

  const handleCopyContent = async (
    content: string,
    channelId: string,
    sourceType: string
  ) => {
    try {
      await copyContent({ content, channelId, sourceType });
      return true;
    } catch (e) {
      return false;
    }
  };

  if (isError) {
    return (
      <div>
        <Title level={3}>Edit Content</Title>
        Something went wrong
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Title level={3}>Edit Content</Title>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Edit Content: {data.channel?.username}</Title>
      <Editor
        onSave={handleSaveContent}
        isSaving={isSaving || isCopieng}
        content={data.content || ""}
        availableTargetsToCopy={data.targetsToCopy}
        onContentCopy={handleCopyContent}
      />
    </div>
  );
}

export default ContentEditor;
