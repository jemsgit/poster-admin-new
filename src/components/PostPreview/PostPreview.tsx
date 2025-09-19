import { useEffect, useState } from "react";
import {
  ContentType,
  PostingType,
  LoadImageConfig,
} from "../../models/channel";
import { markupToHtml, parseChannelContent } from "../../utils/post-parser";
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
      let parsedContent = parseChannelContent(text, type, loadImage);
      if (parsedContent?.photo?.indexOf("source:") === 0) {
        parsedContent.photo = parsedContent.photo.replace(
          "source:",
          "/api/utils/image?source="
        );
      }
      if (!parsedContent) parsedContent = { text: "" };
      parsedContent.text = markupToHtml(parsedContent.text || "");
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
      {content.photo && (
        <div className={styles.media}>
          <img src={content.photo} />
        </div>
      )}
      {content.video && <div className={styles.media}>video</div>}
      <span dangerouslySetInnerHTML={{ __html: content.text || "" }} />
    </div>
  );
}

export default PostPreview;
