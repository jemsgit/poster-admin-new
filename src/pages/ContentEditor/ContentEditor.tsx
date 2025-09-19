import { Button, Flex, message, Typography } from "antd";
import { useLoaderApi } from "../../utils/router";
import { ContentEditData } from "./types";
import {
  useCopyContentMutation,
  useSaveContentMutation,
} from "../../store/channels/api";
import { useParams } from "react-router-dom";
import styles from "./ContentEditor.module.css";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store/store";
import {
  setContentParams,
  setCurrentPostData,
} from "../../store/editor/editor";
import {
  ContentType,
  LoadImageConfig,
  PostingType,
} from "../../models/channel";
import EditorSidebar from "../../components/EditorSidebar/EditorSidebar";
import StringListEditor from "../../components/StringListEditor/StringListEditor";
import MarkupEditor from "../../components/MarkupEditor/MarkupEditor";

const { Title } = Typography;

function ContentEditor() {
  const [items, setItems] = useState<string[]>([]);
  const [isMarkupOpen, setMarkupOpen] = useState(false);
  const [markupInitial, setMarkupInitial] = useState("");
  const { data, isLoading, isError } = useLoaderApi<ContentEditData>();
  const { type } = useParams();
  const dispatch = useAppDispatch();
  const [saveContent] = useSaveContentMutation();
  const [copyContent] = useCopyContentMutation();
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
    dispatch,
  ]);

  const handleSaveContent = (content: string) => {
    if (!data || !data.channel || !type) {
      return;
    }
    try {
      saveContent({
        content,
        channelId: data.channel.username,
        type,
      }).unwrap();
      message.success("Saved!");
    } catch {
      message.error("Error Saving!");
    }
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
      await copyContent({ content, channelId, sourceType }).unwrap();
      message.success("Copied!");
      return true;
    } catch {
      message.error("Error Copy!");
      return false;
    }
  };

  useEffect(() => {
    if (data?.content) {
      setItems(data.content.split("\n"));
    }
  }, [data?.content]);

  const handleAddNewPost = () => {
    setMarkupInitial("");
    setMarkupOpen(true);
  };

  const handleSaveNewPost = (val: string) => {
    setItems((prev) => [val, ...prev]);
    setMarkupOpen(false);
    handleSaveContent([val, ...items].join("\n"));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || data?.content === undefined) {
    return <div>Error loading data</div>;
  }

  // if (isSaving || isCopieng) {
  //   return <div>Saving...</div>;
  // }

  return (
    <div>
      <Title level={3}>Edit Content: {data?.channel?.username}</Title>

      <Button
        type="primary"
        onClick={handleAddNewPost}
        style={{ marginBottom: 12 }}
      >
        Add New Post
      </Button>
      <MarkupEditor
        initialValue={markupInitial}
        open={isMarkupOpen}
        onSave={handleSaveNewPost}
        onCancel={() => setMarkupOpen(false)}
        type={data?.channel?.postingSettings.type as string}
        contentType={type as ContentType}
        loadImage={data?.channel?.postingSettings.loadImage as LoadImageConfig}
      />
      <Flex gap={12} align="flex-start">
        <StringListEditor
          initialStrings={items}
          onChange={(strings) => {
            setItems(strings);
            handleSaveContent(strings.join("\n"));
          }}
          availableTargetsToCopy={data?.targetsToCopy}
          onContentCopy={handleCopyContent}
          onActiveItemChange={(item) => {
            if (activeElementRef) {
              activeElementRef.current = undefined;
            }
            handleSetCurrentContent(item);
          }}
          onSidebarIconClick={() => {
            setMobileSidebar(true);
          }}
          type={data?.channel?.postingSettings.type as string}
          contentType={type as string}
          loadImage={data?.channel?.postingSettings.loadImage}
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
