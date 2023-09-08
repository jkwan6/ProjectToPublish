import { SafeHtml } from "@angular/platform-browser";

export interface IBlog {
  id?: string;
  author: string;
  blogTime?: string;
  blogThumbnail?: string;
  blogBody: string | SafeHtml;
  blogTitle: string;
}
