interface directoryList {
  name: string;
  children?: directoryList[];
  path: string;
  value?: number;
}
type directoryMap = Record<string, directoryList>;
