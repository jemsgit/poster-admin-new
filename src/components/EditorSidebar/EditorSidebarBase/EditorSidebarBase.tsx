import { Button, Flex, Form, Input, Segmented } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CopyOutlined } from "@ant-design/icons";
import PostPreview from "../../PostPreview/PostPreview";
import { RootState } from "../../../store/store";

import styles from "./EditorSidebarBase.module.css";
import { useAskMutation } from "../../../store/editor/api";
import { copyTextToClipboard } from "../../../utils/editor";
import ContentHelper from "../../ContentHelper/ContentHelper";
import { PostingType } from "../../../models/channel";

interface Props {
  className?: string;
  onActiveContentUpdate: (text: string) => void;
}

type View = "Post preview" | "AI Helper" | "Content Helper";

const TRANSLATE_PROMPT = "Translate to russian: ";
const SUMMARIZE_PROMPT =
  "Summarize the article: {link}? The output should be in Russian and follow format: Short, clear title; Brief description (1–2 sentences)";

function EditorSidebarBase({ className, onActiveContentUpdate }: Props) {
  const { text, type, loadImage, contentType } = useSelector(
    (state: RootState) => state.editor
  );
  const [view, setView] = useState<View>("Post preview");
  const [aiRequest, setRequest] = useState(text);
  const [askForSuggestion, { data, isLoading }] = useAskMutation();
  const [result, setResult] = useState("");

  useEffect(() => {
    setRequest(text);
  }, [text]);

  useEffect(() => {
    if (data?.answer) {
      setResult(data.answer);
    }
  }, [data]);

  const handleAiForTranslate = () => {
    const question = `${TRANSLATE_PROMPT} "${text}"`;
    askForSuggestion({ question });
  };

  const handleAiForSummarize = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (text) {
      const match = text.match(urlRegex);
      if (match && match[0]) {
        const question = SUMMARIZE_PROMPT.replace("{link}", match[0]);
        askForSuggestion({ question });
      }
    }
  };

  const handleAiAsk = () => {
    if (aiRequest) {
      askForSuggestion({ question: aiRequest });
    }
  };

  return (
    <div className={`${className || ""} ${styles.sidebar}`}>
      <Segmented<View>
        options={["Post preview", "AI Helper", "Content Helper"]}
        onChange={setView}
        className={styles.toggle}
      />
      {view === "Post preview" && (
        <PostPreview
          text={text}
          type={type}
          loadImage={loadImage}
          contentType={contentType}
        />
      )}{" "}
      {view === "AI Helper" && (
        <Form disabled={isLoading} className="">
          <Flex gap={4}>
            <Button
              type="primary"
              onClick={handleAiForSummarize}
              style={{ marginBottom: 10 }}
            >
              Describe Post
            </Button>
            <Button
              type="primary"
              onClick={handleAiForTranslate}
              style={{ marginBottom: 10 }}
            >
              Translate
            </Button>
          </Flex>
          <Input.TextArea
            rows={4}
            value={aiRequest}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Enter your request"
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" onClick={handleAiAsk}>
            Submit
          </Button>
          <Input.TextArea
            rows={6}
            value={result}
            onChange={(e) => {
              setResult(e.target.value);
            }}
            placeholder="AI response will appear here"
            style={{ marginTop: 10 }}
          />
          <div className={styles.resultButtons}>
            <Button type="primary" onClick={() => copyTextToClipboard(result)}>
              <CopyOutlined />
            </Button>
            <Button
              type="primary"
              onClick={() => onActiveContentUpdate(result)}
            >
              Update post
            </Button>
          </div>
        </Form>
      )}
      {view === "Content Helper" && (
        <ContentHelper
          text={text as string}
          type={type as PostingType}
          loadImage={loadImage}
        />
      )}
    </div>
  );
}

export default EditorSidebarBase;
