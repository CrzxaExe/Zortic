/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

type Note = {
  filename: string;
  title: string;
  content: string;
}

type Action = {
    label: string;
    icon:  DefineComponent<{}, {}, any>;
}

type ActionFunction = {
  callback: (...args: any[]) => void;
}