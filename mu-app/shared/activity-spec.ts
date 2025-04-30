export interface ActivityTrigger {
    fn: string;
    arg: any;
  }
  
  export interface ActivitySpec {
    title: string;
    description: string;
    contact_character: string;
    instructions?: string;
    on_start?: ActivityTrigger[];
    on_finish?: ActivityTrigger[];
  }