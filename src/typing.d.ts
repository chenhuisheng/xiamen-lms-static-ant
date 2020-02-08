import { UploadFile } from "antd/lib/upload/interface";

export interface CurrentAccount {
  id: number
  name: string
  phone: string
}

export interface Topic {
  id: number
  title: string
  summary: string
}

export interface VideoUploadFile {
  file_size?: number
  file_name?: string
  title?: string
  image?: string
  file_path?: string
  author?: string
  projects?: Topic[]
  project_ids?: number[]
}

export interface Book {
  id: number
  book_type: string
  file_name: string
  title: string
  image: string
  author: string
  isbn: string
  publisher: string
  pub_date: string
  pages: number
  summary: string
  catalog: string
  file_path: string
  file_size?: number
  file_type?: 'pdf' | 'epub'
  project_ids?: number[]
  projects?: Topic[]
  video_info: VideoUploadFile[]
}

export interface Videos {
  id: number
  title: string
  image: string
  author: string
  file_path: string
  file_size?: number
  file_type?: 'mp4' | 'flv' | 'mkv' | 'avi' | 'rmvb'
}

export interface ImageCardData {
  id: number
  url: string
  title?: string
  type: string
  summary?: string
  created_at?: string
  index: number
  project_ids?: number[]
  projects?: Topic[]
}

export interface Count {
  id: number
  title: string
  count: number
}

export interface Statistics {
  all_click_count?: Count[]
  book_read_count?: Count[]
  video_play_count?: Count[]
}

