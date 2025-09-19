import StringListItem from "../StringListItem/StringListItem";
import React, { useState, useMemo, useEffect } from "react";
import { Button, Flex, Modal, Dropdown, MenuProps } from "antd";
import styles from "./StringListEditor.module.css";
import MarkupEditor from "../MarkupEditor/MarkupEditor";
import useDesktopMode from "../../hooks/useDesktopMode";
import { markupToHtml, parseChannelContent } from "../../utils/post-parser";
import { LoadImageConfig, PostingType } from "../../models/channel";
import { processContentItemClick } from "../../utils/editor";

interface StringListEditorProps {
  initialStrings: string[];
  onChange?: (strings: string[]) => void;
  availableTargetsToCopy?: { key: string; label: string }[];
  onContentCopy?: (
    content: string,
    channel: string,
    target: string
  ) => Promise<boolean>;
  onActiveItemChange?: (item: string, index: number) => void;
  onSidebarIconClick: () => void;
  type: string;
  contentType: string;
  loadImage?: LoadImageConfig;
}

const StringListEditor: React.FC<StringListEditorProps> = ({
  initialStrings,
  contentType,
  type,
  loadImage,
  onChange,
  availableTargetsToCopy = [],
  onContentCopy,
  onActiveItemChange,
  onSidebarIconClick,
}) => {
  const [items, setItems] = useState<string[]>(initialStrings);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [reorderedItems, setReorderedItems] = useState<string[] | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isDesktop = useDesktopMode();

  useEffect(() => {
    setItems(initialStrings);
  }, [initialStrings]);

  const handleSetActive = (idx: number) => {
    setActiveIndex(idx);
    if (onActiveItemChange) {
      onActiveItemChange(currentItems[idx], idx);
    }
  };
  const handleSelectItem = (idx: number, checked: boolean) => {
    setSelectedIndexes((prev) => {
      if (checked) return [...prev, idx];
      return prev.filter((i) => i !== idx);
    });
  };

  // Use reorderedItems if present, else items
  const currentItems = reorderedItems || items;

  const handleCopySelected: MenuProps["onClick"] = async (e) => {
    const [sourceType, channelId] = e.keyPath;
    const content = selectedIndexes
      .sort((a, b) => a - b)
      .map((i) => currentItems[i])
      .join("\r\n");
    if (onContentCopy) {
      const success = await onContentCopy(content, channelId, sourceType);
      if (success) {
        setSelectionMode(false);
        setSelectedIndexes([]);
      }
    }
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= currentItems.length) return;
    const newItems = [...currentItems];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setReorderedItems(newItems);
  };

  // Drag and drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const newItems = [...currentItems];
    const [dragged] = newItems.splice(draggedIdx, 1);
    newItems.splice(idx, 0, dragged);
    setReorderedItems(newItems);
    setDraggedIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handleSaveReorder = () => {
    if (reorderedItems) {
      setItems(reorderedItems);
      setReorderedItems(null);
      onChange?.(reorderedItems);
    }
  };
  const handleCancelReorder = () => {
    setReorderedItems(null);
    setDraggedIdx(null);
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditValue(currentItems[idx]);
  };

  const handleEditSave = (newValue: string) => {
    if (editingIndex === null) return;
    const newItems = [...currentItems];
    newItems[editingIndex] = newValue;
    setItems(newItems);
    setEditingIndex(null);
    setEditValue("");
    onChange?.(newItems);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue("");
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

  // Memoize parsed items for performance
  const parsedItems = useMemo(() => {
    return currentItems.map((item) => {
      let parsed = parseChannelContent(item, type as PostingType, loadImage);
      if (!parsed) parsed = { text: "" };
      parsed.text = markupToHtml(parsed.text || "");
      return parsed;
    });
  }, [currentItems, type, loadImage]);

  return (
    <div className={styles.listEditor}>
      <Flex vertical gap={8}>
        <Flex gap={8} align="center" wrap>
          <Button
            size="large"
            type={selectionMode ? "primary" : "default"}
            onClick={() => {
              setSelectedIndexes([]);
              setSelectionMode((m) => !m);
            }}
          >
            {selectionMode ? "Cancel" : "Select"}
          </Button>
          {selectionMode && (
            <>
              <Dropdown
                menu={{
                  items: availableTargetsToCopy,
                  onClick: handleCopySelected,
                }}
              >
                <Button size="large" disabled={selectedIndexes.length === 0}>
                  Copy Selected To...
                </Button>
              </Dropdown>
              <Button
                size="large"
                disabled={selectedIndexes.length === 0}
                onClick={() => {
                  Modal.confirm({
                    title: "Delete Selected Items",
                    content: `Are you sure you want to delete ${selectedIndexes.length} selected item(s)?`,
                    okText: "Delete",
                    okType: "danger",
                    cancelText: "Cancel",
                    onOk: () => {
                      const newItems = currentItems.filter(
                        (_, idx) => !selectedIndexes.includes(idx)
                      );
                      setItems(newItems);
                      setSelectedIndexes([]);
                      setSelectionMode(false);
                      setReorderedItems(null);
                      onChange?.(newItems);
                    },
                  });
                }}
              >
                Delete
              </Button>
            </>
          )}
          {!isDesktop ? (
            <Button
              htmlType="button"
              size="large"
              className={styles.controlButton}
              onClick={onSidebarIconClick}
            >
              Sidebar
            </Button>
          ) : null}
          {/* Drag reorder controls */}
          <Button
            size="large"
            type="primary"
            disabled={!reorderedItems}
            onClick={handleSaveReorder}
          >
            Save
          </Button>
          <Button
            size="large"
            disabled={!reorderedItems}
            onClick={handleCancelReorder}
          >
            Cancel
          </Button>
        </Flex>
        {currentItems.map((_, idx) => (
          <StringListItem
            key={idx}
            idx={idx}
            // item={item}
            parsed={parsedItems[idx]}
            parsedLength={parsedItems.length}
            active={activeIndex === idx}
            dragged={draggedIdx === idx}
            selectionMode={selectionMode}
            selected={selectedIndexes.includes(idx)}
            onSetActive={handleSetActive}
            onOpenLink={handleOpenLink}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onSelectItem={handleSelectItem}
            onMoveItem={moveItem}
            onEdit={handleEdit}
            onDelete={(deleteIdx) => {
              Modal.confirm({
                title: "Delete Item",
                content: "Are you sure you want to delete this item?",
                okText: "Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk: () => {
                  const newItems = [...currentItems];
                  newItems.splice(deleteIdx, 1);
                  setItems(newItems);
                  setReorderedItems(null);
                  onChange?.(newItems);
                },
              });
            }}
          />
        ))}
      </Flex>

      <MarkupEditor
        open={editingIndex !== null}
        initialValue={editValue}
        type={type as string}
        contentType={contentType}
        loadImage={loadImage as LoadImageConfig}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    </div>
  );
};

export default StringListEditor;
