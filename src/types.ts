import { Request } from 'express';

export type LogFn = (msg: string, tag: string, meta: unknown) => void

export interface Logger {
  info: LogFn
  warning: LogFn
}

export type WebhookHandlerOptions = {
  secretProvider: SecretProvider
  autoValidate?: boolean
  logger?: Logger
}

export type BaseWebhookEvent = {
  event_id: number
  created_at: string
  creator_id: number
  subscription_id: number
};

export type BaseWebhookEventMetadata = {
  event_user_id: string
  request_type: string
}

export type WebhookPingEvent = BaseWebhookEvent & {
  metadata: WebhookPingEventMetadata
  payload: 'ping',
  validation_code?: string
  validation_code_url?: string
};

export type WebhookPingEventMetadata = BaseWebhookEventMetadata;

export type WebhookChangeEventAction = 'created' | 'updated' | 'deleted';

export type WebhookChangeEvent = BaseWebhookEvent & {
  metadata: WebhookChangeEventMetadata
  payload: Record<string, unknown>
};

export type WebhookChangeEventMetadata = BaseWebhookEventMetadata & {
  action: WebhookChangeEventAction
  model: string
  path: string
} & Record<string, string>

export type WebhookEvent = WebhookPingEvent | WebhookChangeEvent;

export type SecretProviderFn = ((req: Request) => Promise<string | null>)
export type SecretProvider = string | SecretProviderFn;
