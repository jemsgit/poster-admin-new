import { PostingType, LoadImageConfig } from "../models/channel";
import PostBuilder, { Post } from "./postBuilder";

interface TagMessageSplitterResult {
  tags: string[];
  text: string[];
}

const hashtagSeparator = "##";

export function parseChannelContent(
  text?: string,
  type?: PostingType,
  loadImage?: LoadImageConfig
): void | Post {
  if (!text) {
    return undefined;
  }

  if (!type) {
    type = "custom";
  }

  switch (type) {
    case "links":
      return linkMessageParseTg(text, loadImage);
    case "video":
      return videoMessageParseTg(text);
    case "custom":
      return defaultMessageParseTg(text);
    default:
      return defaultMessageParseTg(text);
  }
}

function defaultMessageParseTg(text: string): Post {
  return {
    text,
  };
}

function videoMessageParseTg(postData: string): Post {
  const postBuilder = new PostBuilder();

  const dataList = postData.split(" ");
  const link = dataList.splice(0, 1)[0];
  const hashResult = separateHashTags(dataList);

  postBuilder
    .setVideoLink(link)
    .setHashTags(hashResult.tags)
    .setText(hashResult.text.join(" "));

  return postBuilder.build();
}

function linkMessageParseTg(
  postData: string,
  loadImageConfig?: LoadImageConfig
): Post {
  const dataList = postData.split(" ");
  const link = dataList.splice(0, 1)[0];
  const hashResult = separateHashTags(dataList);
  const imageResult = separateImage(hashResult.text);
  const videoResult = separateVideo(hashResult.text);
  const textSource =
    imageResult.text.length < videoResult.text.length
      ? imageResult
      : videoResult;
  const text = textSource.text.join(" ");
  const hasAttachImageLink = text.match(/(\[\s\]\(http)/g);
  const loadImage =
    hasAttachImageLink || imageResult.imageUrl
      ? false
      : checkLoadImage(loadImageConfig);

  const postBuilder = new PostBuilder();

  postBuilder
    .setLink(link)
    .setHashTags(hashResult.tags)
    .setImage(imageResult.imageUrl)
    .setVideoLink(videoResult.videoUrl)
    .setText(text);

  if (
    loadImage &&
    !postBuilder.photo &&
    !postBuilder.video &&
    postBuilder.text.length +
      postBuilder.hashTags.length +
      postBuilder.link.length <
      1024
  ) {
    postBuilder.setImage("source:" + link);
  }
  return postBuilder.build();
}

function separateHashTags(messageParts: string[]): TagMessageSplitterResult {
  const message: string[] = [];
  const tags: string[] = [];
  messageParts.forEach(function (word) {
    if (word.indexOf(hashtagSeparator) === 0) {
      tags.push(word.slice(1));
    } else {
      message.push(word);
    }
  });
  return {
    tags: tags,
    text: message,
  };
}

function separateImage(messageParts: string[]) {
  const imgRegexp = /(\[img-at\]\((http).*\))/g;
  const message: string[] = [];
  const images: string[] = [];
  messageParts.forEach(function (word) {
    if (word.match(imgRegexp)) {
      images.push(word);
    } else {
      message.push(word);
    }
  });
  let image;
  if (images[0]) {
    image = images[0].replace("[img-at](", "").replace(")", "");
  }

  return {
    imageUrl: image,
    text: message,
  };
}

function separateVideo(messageParts: string[]) {
  const imgRegexp = /(\[video-at\]\((http).*\))/g;
  const message: string[] = [];
  const videos: string[] = [];
  messageParts.forEach(function (word) {
    if (word.match(imgRegexp)) {
      videos.push(word);
    } else {
      message.push(word);
    }
  });
  let video;
  if (videos[0]) {
    video = videos[0].replace("[video-at](", "").replace(")", "");
  }

  return {
    videoUrl: video,
    text: message,
  };
}

function checkLoadImage(param?: LoadImageConfig) {
  let loadImage;
  let isExcluded;
  switch (param) {
    case true:
      loadImage = true;
      break;
    case "random":
      isExcluded = false;
      loadImage = isExcluded ? false : Math.random() >= 0.5;
      break;
    default:
      loadImage = false;
  }
  return loadImage;
}

export function markupToHtml(text: string) {
  return text.replace(/\*([^*]+)\*/g, "<b>$1</b>");
}
