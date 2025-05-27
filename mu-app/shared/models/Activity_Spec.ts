import { toolsMap } from '../../mu-api/core/llm/chatAnalysis';
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
  /** Must match a key in toolsMap */
  to_finish?: keyof typeof toolsMap;
  on_start?: ActivityTrigger[];
  on_finish?: ActivityTrigger[];
}
