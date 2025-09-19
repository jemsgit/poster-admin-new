export interface Post {
  video?: string;
  photo?: string;
  text?: string;
}

export default class PostBuilder {
  text: string;
  hashTags: string;
  photo: string | undefined;
  link: string;
  video: string | undefined;

  constructor() {
    this.text = "";
    this.hashTags = "";
    this.photo = undefined;
    this.link = "";
    this.video = undefined;
  }

  setImage(image: string | undefined): PostBuilder {
    this.photo = image;
    return this;
  }

  setVideoLink(link: string | undefined): PostBuilder {
    this.video = link;
    return this;
  }

  setHashTags(hastags: string[]): PostBuilder {
    this.hashTags =
      hastags && hastags.length ? hastags.slice().join(" ") + "\n\n" : "";
    return this;
  }

  setLink(link: string): PostBuilder {
    // _ sign makes text style italian so we have to wrap it with 'link' markup
    if (link && link.indexOf("_") === 0) {
      link = "[" + link + "](" + link + ")";
    }
    this.link = link;
    return this;
  }

  setText(text: string): PostBuilder {
    text = text.replace(/(\/\/\/n)/g, "\n");
    this.text = text && text.length ? text + "\n\n" : "";
    return this;
  }

  build(): Post {
    const result: Post = {
      text: this.hashTags + this.text + this.link,
    };
    result.text = result.text?.trim();
    if (this.photo) {
      result.photo = this.photo;
    }

    if (this.video) {
      result.video = this.video;
      result.photo = undefined;
    }
    return result;
  }
}
