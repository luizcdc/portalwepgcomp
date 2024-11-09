export class QueueMessageDto {
  id: string;
  data: {
    [key: string]: string;
  };
}

export class ContactEmailErrorMessageDto {
  error: string;
  from: string;
  text: string;
  retries: number;
}

export class ContactEmailServerLimitMessageDto {
  from: string;
  text: string;
  retries: number;
}

export class QueueMessageResponseDto {
  message?: string;
  error?: string;
}
