export interface RouterLoader<T = any> {
  data: Promise<T>;
}
