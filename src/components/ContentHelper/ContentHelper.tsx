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
import { LoadImageConfig, PostingType } from "../../models/channel";
import { useEffect, useState } from "react";

const { Paragraph } = Typography;

const ContentHelper: React.FC<{
  text: string;
  type: PostingType;
  loadImage: LoadImageConfig;
}> = ({ text }) => {
  const splited = text.split(" ");
  const [trigger, { data, isFetching, error }] = useLazyFetchImagesQuery();
  const [value, setValue] = useState(splited[0]);

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

  return (
    <Flex vertical gap={4}>
      <Flex gap={8}>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <Button onClick={handleDataLoad}>Load New</Button>
      </Flex>
      {isFetching && <Spin />}
      {!isFetching && !error && !!data && (
        <>
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
                    {data.article}
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
