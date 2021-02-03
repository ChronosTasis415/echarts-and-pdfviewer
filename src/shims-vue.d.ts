declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module 'uuid';

declare type PlainObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
};