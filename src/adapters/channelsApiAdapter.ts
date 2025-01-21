import { Channel, ContentCopyTarget } from "../models/channel";

export function mapChannelsToTargets(channels: Channel[]): ContentCopyTarget[] {
  let mapped = channels.reduce((acc, cur) => {
    if (!acc[cur.username]) {
      acc[cur.username] = [];
    }
    const targets = ["main", "draft", "result", "rss-list", "rss-result"];
    acc[cur.username] = targets.slice();
    return acc;
  }, {} as Record<string, string[]>);
  let targets: ContentCopyTarget[] = [];

  for (let [key, val] of Object.entries(mapped)) {
    targets.push({
      key,
      label: key,
      children: val.map((item) => ({ label: item, key: item })),
    });
  }
  return targets;
}
