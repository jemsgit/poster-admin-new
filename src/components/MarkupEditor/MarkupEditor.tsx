import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, Input, Modal, Tabs } from "antd";
import { TextAreaRef } from "antd/es/input/TextArea";
import { FormOutlined } from "@ant-design/icons";
import PostPreview from "../PostPreview/PostPreview";
import {
  ContentType,
  LoadImageConfig,
  PostingType,
} from "../../models/channel";
import RulesInfo from "../RulesInfo/RulesInfo";
import ContentHelper from "../ContentHelper/ContentHelper";
import style from "./MarkupEditor.module.css";

interface MarkupEditorProps {
  initialValue: string;
  open: boolean;
  type: string;
  contentType: string;
  loadImage: LoadImageConfig;
  onSave: (val: string) => void;
  onCancel: () => void;
}

const MarkupEditor: React.FC<MarkupEditorProps> = ({
  initialValue,
  open,
  type,
  contentType,
  loadImage,
  onSave,
  onCancel,
}) => {
  const inputRef = useRef<TextAreaRef>(null);
  const [value1, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Helper to get selection
  const getSelection = () => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return { start: 0, end: 0 };
    return { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 };
  };

  // Insert at cursor
  const insertAtCursor = (text: string) => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return;
    const { start, end } = getSelection();
    const newValue = value1.slice(0, start) + text + value1.slice(end);
    setValue(newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // Wrap selection with markup
  const wrapSelection = (before: string, after: string) => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return;
    const { start, end } = getSelection();
    const selected = value1.slice(start, end);
    const newValue =
      value1.slice(0, start) + before + selected + after + value1.slice(end);
    setValue(newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Button handlers
  const handleAddNewString = () => insertAtCursor("///n");
  const handleBold = () => wrapSelection("*", "*");
  const handleAddImage = () => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return;
    const { start, end } = getSelection();
    const before = value1.slice(0, start);
    const after = value1.slice(end);
    const markup = "[img-at](https://)";
    const newValue = before + markup + after;
    setValue(newValue);
    setTimeout(() => {
      el.focus();
      // Place cursor between parentheses
      const cursorPos = before.length + "[img-at](https://".length;
      el.setSelectionRange(before.length + "[img-at](".length, cursorPos);
    }, 0);
  };
  const handleAddVideo = () => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return;
    const { start, end } = getSelection();
    const before = value1.slice(0, start);
    const after = value1.slice(end);
    const markup = "[video-at](https://)";
    const newValue = before + markup + after;
    setValue(newValue);
    setTimeout(() => {
      el.focus();
      // Place cursor between parentheses
      const cursorPos = before.length + "[video-at](https://".length;
      el.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleAddHashtag = () => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return;
    const { start, end } = getSelection();
    const before = value1.slice(0, start);
    const after = value1.slice(end);
    const markup = "##";
    const newValue = before + markup + after;
    setValue(newValue);
    setTimeout(() => {
      el.focus();
      // Place cursor after ##
      const cursorPos = before.length + markup.length;
      el.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const onOk = () => {
    onSave(value1.replace(/\n/g, "///n"));
  };

  const pasteFromClipboard = async () => {
    const el = inputRef.current?.resizableTextArea?.textArea;
    if (!el) return;
    const text = await navigator.clipboard.readText();
    if (!text) {
      return;
    }
    const { start, end } = getSelection();
    const before = value1.slice(0, start);
    const after = value1.slice(end);
    const newValue = before + text + after;
    setValue(newValue);
    setTimeout(() => {
      el.focus();
      // Place cursor after ##
      const cursorPos = before.length + text.length;
      el.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <Modal
      open={open}
      title="Edit Item"
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
      centered
    >
      <div>
        <RulesInfo />
        <Tabs
          defaultActiveKey="Editor"
          items={[
            {
              key: "Editor",
              label: "Editor",
              children: (
                <Flex vertical gap={8}>
                  <Flex gap={8}>
                    <Button size="middle" onClick={handleAddNewString}>
                      /n
                    </Button>
                    <Button size="middle" onClick={handleBold}>
                      b
                    </Button>
                    <Button size="middle" onClick={handleAddImage}>
                      img
                    </Button>
                    <Button size="middle" onClick={handleAddVideo}>
                      video
                    </Button>
                    <Button size="middle" onClick={handleAddHashtag}>
                      #
                    </Button>
                  </Flex>
                  <Input.TextArea
                    ref={inputRef}
                    rows={4}
                    value={value1}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter your request"
                    autoFocus
                    style={{
                      width: "100%",
                      minHeight: "300px",
                      resize: "vertical",
                      fontSize: 16,
                      lineHeight: "24px",
                    }}
                    className={style.input}
                  />
                  <Button
                    icon={<FormOutlined />}
                    onClick={pasteFromClipboard}
                  />
                </Flex>
              ),
            },
            {
              key: "Post Preview",
              label: "Post Preview",
              children: (
                <PostPreview
                  text={value1}
                  type={type as PostingType}
                  contentType={contentType as ContentType}
                  loadImage={loadImage}
                />
              ),
            },
            {
              key: "Content Helper",
              label: "Content Helper",
              children: (
                <ContentHelper
                  text={value1}
                  type={type as PostingType}
                  loadImage={loadImage}
                />
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default MarkupEditor;
