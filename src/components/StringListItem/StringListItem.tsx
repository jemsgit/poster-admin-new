import React from "react";
import { Button, Flex } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import styles from "./StringListItem.module.css";
import { Post } from "../../utils/postBuilder";
import useDesktopMode from "../../hooks/useDesktopMode";

function getPostIconColor(post: Post) {
  if (post.photo) return "#7cc0ffff";
  if (post.video) return "#fac286ff";
  return "#d9d9d9";
}

interface StringListItemProps {
  idx: number;
  parsed: any;
  parsedLength: number;
  active: boolean;
  dragged: boolean;
  selectionMode: boolean;
  selected: boolean;
  onSetActive: (idx: number) => void;
  onOpenLink: (e: MouseEvent) => void;
  onDragStart: (idx: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (idx: number) => void;
  onDragEnd: () => void;
  onSelectItem: (idx: number, checked: boolean) => void;
  onMoveItem: (from: number, to: number) => void;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
}

const StringListItem: React.FC<StringListItemProps> = ({
  idx,
  parsed,
  parsedLength,
  active,
  dragged,
  selectionMode,
  selected,
  onSetActive,
  onOpenLink,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onSelectItem,
  onMoveItem,
  onEdit,
  onDelete,
}) => {
  const isDesktop = useDesktopMode();
  return (
    <Flex
      key={idx}
      align="center"
      gap={8}
      className={`${styles.itemRow} ${active ? styles.activeItem : ""} ${
        selected && selectionMode ? styles.selectedItem : ""
      } ${selectionMode ? styles.selectionMode : ""}`}
      style={{
        opacity: dragged ? 0.5 : 1,
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains(styles.dragHandle))
          return;
        onOpenLink(e as unknown as MouseEvent);
        if (!selectionMode) onSetActive(idx);
        if (selectionMode) onSelectItem(idx, !selected);
      }}
      onDragOver={onDragOver}
      onDrop={() => onDrop(idx)}
      onDragEnd={onDragEnd}
    >
      <span
        className={styles.dragHandle}
        draggable={!selectionMode}
        onDragStart={() => onDragStart(idx)}
        style={{
          cursor: !selectionMode ? "grab" : "default",
          marginLeft: "2px",
          padding: "0 8px",
          userSelect: "none",
          minHeight: "100%",
          background: getPostIconColor(parsed),
        }}
        title="Drag to reorder"
      >
        ≡
      </span>
      <span>{idx}</span>
      <Flex gap={8} vertical={!isDesktop} justify="space-between" flex={1}>
        <span
          className={styles.itemText}
          dangerouslySetInnerHTML={{ __html: parsed.text || "no text" }}
        ></span>

        <Flex vertical gap={4}>
          <Flex gap={4}>
            <Button
              size="large"
              className={styles.actionButton}
              onClick={() => onMoveItem(idx, 0)}
              disabled={idx === 0 || selectionMode}
              icon={<VerticalAlignTopOutlined />}
            />

            <Button
              size="large"
              onClick={() => onMoveItem(idx, parsedLength - 1)}
              disabled={idx === parsedLength - 1 || selectionMode}
              icon={<VerticalAlignBottomOutlined />}
            />

            <Button
              size="large"
              onClick={() => onMoveItem(idx, idx - 1)}
              disabled={idx === 0 || selectionMode}
              icon={<UpCircleOutlined />}
            />

            <Button
              size="large"
              onClick={() => onMoveItem(idx, idx + 1)}
              disabled={idx === parsedLength - 1 || selectionMode}
              icon={<DownCircleOutlined />}
            />
          </Flex>
          <Flex gap={4}>
            <Button
              size="large"
              block
              onClick={() => onEdit(idx)}
              disabled={selectionMode}
              icon={<EditOutlined />}
            ></Button>
            <Button
              size="large"
              block
              danger
              onClick={() => onDelete(idx)}
              disabled={selectionMode}
              icon={<DeleteOutlined />}
            ></Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StringListItem;
