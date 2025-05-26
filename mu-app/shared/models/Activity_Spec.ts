/**
 * JSON schema declaration for a Gemini function/tool.
 */

export type ActivityTrigger =
  | {
      fn: "send_message";
      arg: string;
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
  chat_tools?: string[];
  to_finish?: string[];
  on_start?: ActivityTrigger[];
  on_finish?: ActivityTrigger[];
}
