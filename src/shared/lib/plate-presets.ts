import {
  BasicMarksPlugin,
  BoldPlugin,
  ItalicPlugin,
  BlockquotePlugin,
  CodePlugin,
  HeadingPlugin,
} from "@platejs/basic-nodes/react";
import {
  TextAlignPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
} from "@platejs/basic-styles/react";
import { ImagePlugin } from "@platejs/media/react";
import { ListPlugin } from "@platejs/list/react";
import { LinkPlugin } from "@platejs/link/react";
import { CodeBlockPlugin } from "@platejs/code-block/react";
import { ImageElement } from "@shared/ui/plate-editor";

/**
 * 블로그용 플러그인: 헤딩, 마크, 인용문, 코드, 코드블록, 이미지,
 * 텍스트 정렬, 리스트, 링크, 폰트 패밀리/크기/색상
 */
export const BLOG_PLUGINS = [
  HeadingPlugin.configure({ options: { levels: [1, 2, 3] } }),
  BasicMarksPlugin,
  BlockquotePlugin,
  CodePlugin,
  CodeBlockPlugin,
  ImagePlugin.configure({
    render: { node: ImageElement },
  }),
  TextAlignPlugin,
  ListPlugin,
  LinkPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
];

/**
 * 방명록용 플러그인: 볼드, 이탈릭, 글자 크기, 글자 색상, 배경 색상
 */
export const GUESTBOOK_PLUGINS = [
  BoldPlugin,
  ItalicPlugin,
  FontSizePlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
];
