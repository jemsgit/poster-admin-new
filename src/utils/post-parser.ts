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
  let postBuilder = new PostBuilder();

  let dataList = postData.split(" ");
  let link = dataList.splice(0, 1)[0];
  let hashResult = separateHashTags(dataList);

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
  let dataList = postData.split(" ");
  let link = dataList.splice(0, 1)[0];
  let hashResult = separateHashTags(dataList);
  let imageResult = separateImage(hashResult.text);
  let videoResult = separateVideo(hashResult.text);
  const textSource =
    imageResult.text.length < videoResult.text.length
      ? imageResult
      : videoResult;
  let text = textSource.text.join(" ");
  let hasAttachImageLink = text.match(/(\[\s\]\(http)/g);
  let loadImage =
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
    postBuilder.setImage("http://stub.image.com");
  }
  return postBuilder.build();
}

function separateHashTags(messageParts: string[]): TagMessageSplitterResult {
  let message: string[] = [];
  let tags: string[] = [];
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
  let imgRegexp = /(\[img-at\]\((http).*\))/g;
  let message: string[] = [];
  let images: string[] = [];
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
  let imgRegexp = /(\[video-at\]\((http).*\))/g;
  let message: string[] = [];
  let videos: string[] = [];
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
  var loadImage;
  switch (param) {
    case true:
      loadImage = true;
      break;
    case "random":
      var isExcluded = false;
      loadImage = isExcluded ? false : Math.random() >= 0.5;
      break;
    default:
      loadImage = false;
  }
  return loadImage;
}
