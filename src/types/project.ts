export interface ProjectItem {
  id: string;
  name: string;
  type: "file" | "folder" | "project";
  fileType?: string;
  size?: string;
  items?: string;
  icon: string;
  lastModified: string;
  shared: boolean;
  starred: boolean;
  owner: string;
  permissions: "read" | "write" | "admin";
  content?: string;
  description?: string;
  tags?: string[];
  createdAt?: Date;
}

export interface ProjectFilter {
  type: "all" | "file" | "folder" | "project";
  date: "all" | "today" | "week" | "month";
  shared: boolean;
  starred: boolean;
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-asc"
  | "date-desc"
  | "size-asc"
  | "size-desc";
