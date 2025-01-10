type PostingType = "link" | "video";
type LoadImageConfig = boolean | "random";
export type ContentType = "draft" | "main" | "result";

export interface Channel {
  username: string;
  hasDraft: boolean;
  graberSettings: {
    modulePath: string;
    content: string;
    contentResult: string;
    times: string;
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
