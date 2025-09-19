import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button, Dropdown, Flex, MenuProps, Spin } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import { escapeHtml, renderText } from "../../utils/text";
import styles from "./Editor.module.css";
import {
  copyTextToClipboard,
  getSelectionRange,
  isParentEditable,
  processContentItemClick,
  updateSelectedElements,
} from "../../utils/editor";
import { ContentCopyTarget } from "../../models/channel";
import useDesktopMode from "../../hooks/useDesktopMode";

const ACTIVE_CLASS = styles.active;
const SELECTED_TO_MOVE_CLASS = styles.seletedToMove;
const FIXED_BODY_CLASS = styles.fixedPosition;

interface IProps {
  content: string;
  isSaving: boolean;
  availableTargetsToCopy: ContentCopyTarget[];
  className?: string;
  activeElementRef: { current: HTMLElement | undefined };
  onSave: (text: string) => void;
  onContentCopy: (
    content: string,
    channel: string,
    target: string
  ) => Promise<boolean>;
  onContentClick: (text: string) => void;
  onSidebarIconClick: () => void;
}

type ActionFunc = (
  inputRef: React.RefObject<HTMLElement>,
  activeElement: HTMLElement
) => void;

interface Actions {
  up: () => void;
  down: () => void;
  delete: () => void;
  top: () => void;
}

const topAction: ActionFunc = (inputRef, activeElement) => {
  inputRef?.current?.removeChild(activeElement);
  inputRef?.current?.prepend(activeElement);
};

const downAction: ActionFunc = (inputRef, activeElement) => {
  const nextElement = activeElement.nextElementSibling;
  if (!nextElement) {
    return;
  }
  inputRef?.current?.removeChild(activeElement);
  nextElement?.parentNode?.insertBefore(activeElement, nextElement.nextSibling);
};

const upAction: ActionFunc = (inputRef, activeElement) => {
  const prevElement = activeElement.previousElementSibling;
  if (!prevElement) {
    return;
  }
  inputRef?.current?.removeChild(activeElement);
  prevElement?.parentNode?.insertBefore(activeElement, prevElement);
};

const deleteAction: ActionFunc = (inputRef, activeElement) => {
  inputRef?.current?.removeChild(activeElement);
};

const handleOpenLink = (e: MouseEvent) => {
  if (
    !(e.ctrlKey || e.metaKey) ||
    e.target === e.currentTarget ||
    e.button !== 0
  ) {
    return;
  }
  processContentItemClick(e);
};

const actions = {
  up: upAction,
  down: downAction,
  delete: deleteAction,
  top: topAction,
};

type Action = "copyTo" | "copy";

const handleEditorFocus = () => {
  document.body.classList.add(FIXED_BODY_CLASS);
};

const handleEditorBlur = () => {
  document.body.classList.remove(FIXED_BODY_CLASS);
};

let startY = 0;

const handleTouchStart = (event: TouchEvent) => {
  startY = event.touches[0].clientY;
};

const handleTouchScroll = (event: TouchEvent) => {
  const scrollableDiv = event.currentTarget as HTMLElement;
  const isScrollable = scrollableDiv.scrollHeight > scrollableDiv.clientHeight;

  if (isScrollable) {
    const currentY = event.touches[0].clientY;
    const deltaY = startY - currentY;

    if (event.cancelable) {
      event.preventDefault();
    }
    scrollableDiv.scrollTop += deltaY;

    startY = currentY;
  }
};

const Editor = ({
  content,
  isSaving,
  availableTargetsToCopy,
  className,
  activeElementRef,
  onSave,
  onContentCopy,
  onContentClick,
  onSidebarIconClick,
}: IProps) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [elementsRange, setElementsRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const isDesktop = useDesktopMode();

  const handleResetContent = () => {
    if (!inputRef.current) {
      return;
    }
    const currentRef = inputRef.current;
    currentRef!.innerHTML = renderText(content);
  };

  const setActiveElement = useCallback((el?: HTMLElement) => {
    if (!el) {
      onContentClick("");
      if (activeElementRef && activeElementRef.current) {
        activeElementRef.current = undefined;
      }

      return;
    }
    activeElementRef.current = el;
    if (activeRef.current) {
      activeRef.current.classList.remove(ACTIVE_CLASS);
    }
    activeRef.current = el;
    el.classList.add(ACTIVE_CLASS);
    onContentClick(el.innerText);
  }, []);

  const handleMouseClick = (e: MouseEvent) => {
    const el = e.target as HTMLTextAreaElement;
    if (currentAction === "copyTo") {
      const newRangeToCopy = getSelectionRange(el, elementsRange);
      setElementsRange(newRangeToCopy);
      setTimeout(() => {
        updateSelectedElements(
          newRangeToCopy,
          inputRef.current!,
          SELECTED_TO_MOVE_CLASS
        );
      }, 200);
    } else if (isParentEditable(el)) {
      setActiveElement(el);
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, escapeHtml(text));
  };

  const handleContentCopy: MenuProps["onClick"] = async (e) => {
    const [sourceType, channelId] = e.keyPath;
    let content = "";
    const elements = Array.from(inputRef.current!.children);
    if (elementsRange.every((item) => item !== null)) {
      content = elements
        .slice(Math.min(...elementsRange), Math.max(...elementsRange) + 1)
        .map((item) => item.textContent)
        .join("\r\n");
    }
    onContentCopy(content, channelId, sourceType).then((success) => {
      if (success) {
        setElementsRange([null, null]);
        handleActionChange(null);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (![38, 40, 13].includes(e.keyCode) || !activeRef.current) {
      return;
    }

    if (e.key === "Enter" && activeRef.current) {
      e.preventDefault(); // Prevent the default behavior
      const newLine = document.createElement("div");
      newLine.innerHTML = "";
      const selection = window.getSelection();
      if (selection) {
        //const range = selection.getRangeAt(0);
        activeRef.current.after(newLine);
        //range.deleteContents(); // Remove current selection if any
        const newRange = document.createRange();
        newRange.setStart(newLine, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    const prevElement = activeRef.current.previousElementSibling as HTMLElement;
    const nextElement = activeRef.current.nextElementSibling as HTMLElement;
    setActiveElement(e.keyCode === 38 ? prevElement : nextElement);
  };

  const handleSaveContent = useCallback(() => {
    const text = inputRef
      .current!.innerText.replace(/\n\n/g, "\n")
      .replace(new RegExp(String.fromCharCode(160), "g"), " ");
    onSave(text);
  }, [onSave]);

  useEffect(() => {
    if (!inputRef.current) {
      return () => {};
    }
    const currentRef = inputRef.current;

    currentRef.addEventListener("mousedown", handleOpenLink);
    currentRef.addEventListener("mousedown", handleMouseClick);
    currentRef.addEventListener("focus", handleEditorFocus);
    currentRef.addEventListener("blur", handleEditorBlur);

    currentRef.addEventListener("touchstart", handleTouchStart);
    currentRef.addEventListener("touchmove", handleTouchScroll);

    return () => {
      currentRef.removeEventListener("mousedown", handleOpenLink);
      currentRef.removeEventListener("mousedown", handleMouseClick);
      currentRef.removeEventListener("focus", handleEditorFocus);
      currentRef.removeEventListener("blur", handleEditorBlur);

      currentRef.removeEventListener("touchstart", handleTouchStart);
      currentRef.removeEventListener("touchmove", handleTouchScroll);
    };
  }, [content, currentAction, elementsRange]);

  useEffect(() => {
    return handleEditorBlur;
  });

  useEffect(() => {
    if (!inputRef.current) {
      return () => {};
    }
    const currentRef = inputRef.current;
    if (content !== currentRef!.innerHTML) {
      currentRef!.innerHTML = renderText(content);
      currentRef.addEventListener("paste", handlePaste);
      currentRef.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      currentRef.removeEventListener("paste", handlePaste);
      currentRef.removeEventListener("keydown", handleKeyDown);
    };
  }, [content]);

  const handleControlClick = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const action = target.getAttribute("data-type") as keyof Actions;
    if (!activeRef.current || !actions[action]) {
      return;
    }
    actions[action](inputRef, activeRef.current);
    inputRef.current?.focus();
  }, []);

  const handleActionChange = (action: Action | null) => {
    if (action === "copyTo") {
      activeRef.current?.classList.remove(ACTIVE_CLASS);
    } else if (action === "copy") {
      copyTextToClipboard(activeRef.current?.innerText || "");
      return;
    }
    if (!action) {
      const content = Array.from(inputRef.current?.children || []);
      content.forEach((item) => item.classList.remove(SELECTED_TO_MOVE_CLASS));
    }
    setCurrentAction(action);
  };

  const renderAdditional = () => {
    if (currentAction === "copyTo") {
      return (
        <Flex>
          <Dropdown
            menu={{ items: availableTargetsToCopy, onClick: handleContentCopy }}
          >
            <Button disabled={isSaving}>Destination</Button>
          </Dropdown>
          <Button onClick={() => handleActionChange(null)} disabled={isSaving}>
            Cancel
          </Button>
        </Flex>
      );
    } else {
      return (
        <>
          <Button
            htmlType="button"
            size="small"
            className={styles.controlButton}
            onClick={() => handleActionChange("copyTo")}
          >
            Copy To
          </Button>
          <Button
            htmlType="button"
            size="small"
            className={styles.controlButton}
            onClick={() => handleActionChange("copy")}
          >
            <CopyOutlined />
          </Button>
          {!isDesktop ? (
            <Button
              htmlType="button"
              size="small"
              className={styles.controlButton}
              onClick={onSidebarIconClick}
            >
              Sidebar
            </Button>
          ) : null}
        </>
      );
    }
  };

  return (
    <section className={`${styles.editor} ${className || ""}`}>
      <Flex vertical className={styles.editorControls} gap={5}>
        <Flex gap={5}>
          <Button
            htmlType="button"
            size="small"
            data-type="top"
            onClick={handleControlClick}
            className={styles.controlButton}
            disabled={isSaving}
          >
            Top
          </Button>
          <Button
            htmlType="button"
            size="small"
            data-type="up"
            onClick={handleControlClick}
            className={styles.controlButton}
            disabled={isSaving}
          >
            Up
          </Button>
          <Button
            htmlType="button"
            size="small"
            data-type="down"
            onClick={handleControlClick}
            className={styles.controlButton}
            disabled={isSaving}
          >
            Down
          </Button>
          <Button
            htmlType="button"
            size="small"
            data-type="delete"
            onClick={handleControlClick}
            className={styles.controlButton}
            disabled={isSaving}
          >
            Delete
          </Button>
        </Flex>
        <Flex>{renderAdditional()}</Flex>
      </Flex>
      <div style={{ position: "relative" }}>
        {isSaving && (
          <div className={styles.spinner}>
            <Spin size="large" />
          </div>
        )}
        <div
          ref={inputRef}
          contentEditable="true"
          className={styles.editorContent}
        />
        <Flex gap={12}>
          <Button
            htmlType="button"
            onClick={handleSaveContent}
            disabled={isSaving}
            type="primary"
          >
            Save
          </Button>
          <Button
            htmlType="reset"
            disabled={isSaving}
            onClick={handleResetContent}
          >
            Reset
          </Button>
        </Flex>
      </div>
    </section>
  );
};

export default Editor;
