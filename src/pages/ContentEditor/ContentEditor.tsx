import Editor from "../../components/Editor/Editor";
import { Flex, Typography } from "antd";
import { useLoaderApi } from "../../utils/router";
import { ContentEditData } from "./types";
import {
  useCopyContentMutation,
  useSaveContentMutation,
} from "../../store/channels/api";
import { useParams } from "react-router-dom";
import RulesInfo from "../../components/RulesInfo/RulesInfo";
import styles from "./ContentEditor.module.css";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store/store";
import {
  setContentParams,
  setCurrentPostData,
} from "../../store/editor/editor";
import { ContentType, PostingType } from "../../models/channel";
import EditorSidebar from "../../components/EditorSidebar/EditorSidebar";

const { Title } = Typography;

function ContentEditor() {
  const { data, isLoading, isError } = useLoaderApi<ContentEditData>();
  const { type } = useParams();
  const dispatch = useAppDispatch();
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();
  const [copyContent, { isLoading: isCopieng }] = useCopyContentMutation();
  const [isMobileSidebarOpen, setMobileSidebar] = useState(false);
  const activeElementRef = useRef<HTMLElement | undefined>();

  useEffect(() => {
    if (data?.channel?.postingSettings.type && type) {
      dispatch(
        setContentParams({
          contentType: type as ContentType,
          type: data?.channel?.postingSettings.type as PostingType,
          loadImage: data?.channel?.postingSettings.loadImage,
        })
      );
    }
  }, [
    data?.channel?.postingSettings.loadImage,
    data?.channel?.postingSettings.type,
    type,
  ]);

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

  const handleSetCurrentContent = (text: string) => {
    dispatch(setCurrentPostData({ text }));
  };

  const handleActiveElementSaveContent = (text: string) => {
    if (activeElementRef.current) {
      activeElementRef.current.innerText = text;
    }
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
      <RulesInfo className={styles.rules} />

      <Flex gap={12} align="flex-start">
        <Editor
          onSave={handleSaveContent}
          isSaving={isSaving || isCopieng}
          content={data.content || ""}
          availableTargetsToCopy={data.targetsToCopy}
          onContentCopy={handleCopyContent}
          onContentClick={handleSetCurrentContent}
          onSidebarIconClick={() => {
            setMobileSidebar(true);
          }}
          className={styles.editor}
          activeElementRef={activeElementRef}
        />
        <EditorSidebar
          className={styles.sidebar}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setMobileSidebar(false)}
          onActiveContentUpdate={handleActiveElementSaveContent}
        />
      </Flex>
    </div>
  );
}

export default ContentEditor;
