import {
  Button,
  Collapse,
  Flex,
  Image,
  Input,
  Spin,
  Typography,
  message,
} from "antd";
import { useLazyFetchImagesQuery } from "../../store/editor/api";
import { usePromptsQuery } from "../../store/utils/api"; // <-- RTK Query hook for prompts

import { LoadImageConfig, PostingType } from "../../models/channel";
import { useEffect, useState } from "react";

// ...

const { Paragraph } = Typography;

const ContentHelper: React.FC<{
  text: string;
  type: PostingType;
  loadImage: LoadImageConfig;
}> = ({ text }) => {
  const splited = text.split(" ");
  const [trigger, { data, isFetching, error }] = useLazyFetchImagesQuery();
  const [value, setValue] = useState(splited[0]);
  const [showPrompts, setShowPrompts] = useState(false);

  useEffect(() => {
    trigger(text.split(" ")[0]);
  }, [text, trigger]);

  useEffect(() => {
    setValue(text.split(" ")[0]);
  }, [text]);

  const handleDataLoad = () => {
    trigger(value);
  };

  const handleCopy = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      message.success("Copied!");
    } catch {
      message.error("Failed to copy");
    }
  };

  const handleOpen = () => {
    window.open(value, "_blank");
  };

  const {
    data: promptsData,
    isLoading: isPromptsLoading,
    error: promptsError,
    refetch,
  } = usePromptsQuery(undefined, { skip: !showPrompts });

  const handlePrepatePrompt = () => {
    setShowPrompts(true);
    refetch();
  };

  return (
    <Flex vertical gap={4}>
      <Flex vertical gap={8}>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <Flex gap={8}>
          <Button onClick={() => handleCopy(value)}>Copy</Button>
          <Button onClick={handleOpen}>Open</Button>
          <Button onClick={handleDataLoad}>Load New</Button>
          <Button onClick={handlePrepatePrompt}>Prompt</Button>
        </Flex>
      </Flex>
      {isFetching && <Spin />}
      {!isFetching && !error && !!data && (
        <>
          {showPrompts && (
            <div style={{ margin: "12px 0" }}>
              {isPromptsLoading ? (
                <Spin />
              ) : promptsError ? (
                <Paragraph type="danger">Ошибка загрузки промптов</Paragraph>
              ) : (
                <Flex vertical gap={4}>
                  {(promptsData || []).map(
                    (prompt: { id: string; text: string }) => (
                      <Flex key={prompt.id} align="center" gap={8}>
                        <Paragraph style={{ margin: 0 }}>
                          {prompt.text}
                        </Paragraph>
                        <Button
                          size="small"
                          onClick={() => handleCopy(prompt.text)}
                        >
                          Copy
                        </Button>
                      </Flex>
                    )
                  )}
                </Flex>
              )}
            </div>
          )}
          <Flex vertical gap={8}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {data.images.map((img) => (
                <div
                  key={img.url}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCopy(img.url)}
                >
                  <Image
                    src={`data:image/*;base64,${img.base64}`}
                    alt="preview"
                    width={120}
                    height={120}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    preview={false}
                  />
                </div>
              ))}
            </div>
            Description:
            <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {data.description}
            </Paragraph>
          </Flex>
          <Collapse
            style={{ marginTop: 16 }}
            items={[
              {
                key: "1",
                label: "Show Article",
                children: (
                  <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                    {data.article && data.article.trim()}
                  </Paragraph>
                ),
              },
            ]}
          />
        </>
      )}
    </Flex>
  );
};

export default ContentHelper;
