import { Params } from "react-router-dom";

export interface RouterLoader<T = any> {
  data: Promise<T>;
}

export interface BreadcrumbItem {
  title: string;
  url: string;
}

// Define the structure of our handle object
export interface RouterHandle {
  breadcrumbs: BreadcrumbItem[];
  extraBreadcrumbs?: (params: Readonly<Params<string>>) => BreadcrumbItem[];
  pageTitle?: string;
}
