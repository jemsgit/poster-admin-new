import { MockMethod } from "vite-plugin-mock";

export default function mocks(): MockMethod[] {
  return [
    {
      url: "/api/channels/info",
      method: "get",
      timeout: 200,
      response: () => {
        return [
          {
            username: "front_end_dev",
            hasDraft: true,
            graberSettings: {
              modulePath: "front_grabber",
              times: ["16:30[4]"],
            },
            postingSettings: {
              source: "",
              type: "links",
              times: ["12 08", "15 00"],
              loadImage: "random",
            },
          },
          {
            username: "web_stack",
            hasDraft: true,
            graberSettings: {
              modulePath: "web_stack_grabber",
              times: ["12 08"],
            },
            postingSettings: {
              source: "",
              type: "links",
              times: ["12 08", "15 00"],
              loadImage: "random",
            },
          },
        ];
      },
    },
    {
      url: "/api/channels/info/front_end_dev",
      method: "get",
      timeout: 200,
      response: () => {
        return {
          username: "front_end_dev",
          hasDraft: true,
          graberSettings: {
            modulePath: "front_grabber",
            times: ["12 08"],
          },
          postingSettings: {
            source: "",
            type: "links",
            times: ["12 08", "15 00"],
            loadImage: "random",
          },
        };
      },
    },
    {
      url: "/api/channels/content",
      method: "get",
      timeout: 2000,
      response: () => {
        return {
          channelId: "@front_end_dev",
          content:
            "https://trst.rewr.derw esfrasdnfk lkasjdflk alsdfk a;lsdfk\r\nhttps://vcvfvf.sdfsdf.fsdfsd esfrasdnfk lkasjdflk alsdfk a;lsdfk",
          type: "main",
        };
      },
    },
    {
      url: "/api/channels/copy-content/web_stack/main",
      method: "patch",
      timeout: 2000,
      response: () => {
        return "Ok";
      },
    },
    {
      url: "/api/suggestions/ask",
      method: "post",
      timeout: 200,
      response: () => {
        return {
          answer: "This is the answer" + Math.random(),
          limit: 123,
        };
      },
    },
    {
      url: "/api/bots",
      method: "get",
      timeout: 200,
      response: () => {
        return [
          {
            username: "cute_astro_cat_bot",
          },
          {
            username: "aiko_titkot_download_bot",
          },
        ];
      },
    },
    {
      url: "/api/grabbers",
      method: "get",
      response: () => {
        return [
          {
            name: "front_end_dev_grabber",
            filesList: ["main.js", "module1.js"],
            channel: "front_end_dev",
          },
          {
            name: "web_stack_dev_grabber",
            filesList: ["main.js", "module1.js"],
            channel: "web_stack",
          },
        ];
      },
    },
  ];
}
