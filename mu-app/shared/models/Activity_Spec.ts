import type { SendMessageArg } from "../../mu-api/core/actions/types";

export type ActivityTrigger =
  | {
      fn: "send_message";
      arg: SendMessageArg;
    }
  | {
      fn: "log_event";
      arg: string;
    }
export interface ActivitySpec {
  title: string;
  description: string;
  contact_character: string;
  instructions?: string;
  on_start?: ActivityTrigger[];
  on_finish?: ActivityTrigger[];
}
