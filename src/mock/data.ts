import { MockMethod } from "vite-plugin-mock";

export default function mocks(): MockMethod[] {
  return [
    {
      url: "/api/channels",
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
      url: "/api/channels/front_end_dev",
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
