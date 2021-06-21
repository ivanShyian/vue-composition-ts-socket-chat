export interface NewMessageObjectInterface {
  content: {
    uid: string | string[];
    time: number;
    message: string;
  };
  to: string | string[];
  fromSelf?: boolean
}
