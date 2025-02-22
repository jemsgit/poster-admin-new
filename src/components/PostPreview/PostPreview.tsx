import { useEffect, useState } from "react";
import {
  ContentType,
  PostingType,
  LoadImageConfig,
} from "../../models/channel";
import { parseChannelContent } from "../../utils/post-parser";
import { Post } from "../../utils/postBuilder";

import styles from "./PostPreview.module.css";

interface Props {
  text?: string;
  type?: PostingType;
  contentType?: ContentType;
  loadImage: LoadImageConfig;
}

const contentTypeForPreview = ["main", "draft"];

function PostPreview(props: Props) {
  const { text, type, contentType, loadImage } = props;
  const [content, setContent] = useState<Post | void>();

  useEffect(() => {
    if (
      !text ||
      !contentType ||
      !type ||
      !contentTypeForPreview.includes(contentType)
    ) {
      setContent(undefined);
    } else {
      const parsedContent = parseChannelContent(text, type, loadImage);
      setContent(parsedContent);
    }
  }, [text, type, contentType, loadImage]);

  if (
    !text ||
    !contentType ||
    !type ||
    !contentTypeForPreview.includes(contentType)
  ) {
    return null;
  }

  if (!content) {
    return null;
  }

  return (
    <div className={styles.preview}>
      {content.photo && <div className={styles.media}></div>}
      {content.video && <div className={styles.media}>video</div>}
      {content.text}
    </div>
  );
}

export default PostPreview;
