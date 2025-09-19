export interface Grabber {
  name: string;
  filesList: string[];
  channel: string;
}

export interface GrabberFile {
  fileName: string;
  content: string;
}

export interface GrabberInfo {
  grabbers: GrabberFile[];
}

export interface GrabberTestResponse {
  content: string;
}
