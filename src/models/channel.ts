type PostingType = "link" | "video";
type LoadImageConfig = boolean | "random";
export type ContentType =
  | "draft"
  | "main"
  | "result"
  | "rss-list"
  | "rss-result";

export interface Channel {
  username: string;
  graberSettings?: {
    modulePath: string;
    times: string;
    hasDraft: boolean;
  };
  postingSettings: {
    source: string;
    type: PostingType;
    times: string[];
    loadImage: LoadImageConfig;
  };
}

export interface ContentCopyTarget {
  key: string;
  label: string;
  children: { key: string; label: string }[];
}

export interface ContentInfo {
  channelId: string;
  content: string;
  type: string;
}

export interface RourceItem {
  title: string;
  type: ContentType;
}
