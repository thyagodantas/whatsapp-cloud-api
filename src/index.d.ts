// Type definitions for whatsapp-cloud-api

export interface WhatsAppClientConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion?: string;
}

export interface SendTextOptions {
  to: string;
  text: string;
}

export interface SendImageOptions {
  to: string;
  imageUrl?: string;
  imagePath?: string;
  caption?: string;
}

export interface SendVideoOptions {
  to: string;
  videoUrl?: string;
  videoPath?: string;
  caption?: string;
}

export interface SendDocumentOptions {
  to: string;
  documentUrl?: string;
  documentPath?: string;
  caption?: string;
  filename?: string;
}

export interface SendAudioOptions {
  to: string;
  audioUrl?: string;
  audioPath?: string;
}

export interface ButtonOption {
  id: string;
  title: string;
}

export interface SendButtonsOptions {
  to: string;
  body: string;
  buttons: ButtonOption[];
  header?: string;
  footer?: string;
}

export interface WhatsAppApiResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

export class WhatsAppClient {
  constructor(config: WhatsAppClientConfig);
  
  sendText(options: SendTextOptions): Promise<WhatsAppApiResponse>;
  sendImage(options: SendImageOptions): Promise<WhatsAppApiResponse>;
  sendVideo(options: SendVideoOptions): Promise<WhatsAppApiResponse>;
  sendDocument(options: SendDocumentOptions): Promise<WhatsAppApiResponse>;
  sendAudio(options: SendAudioOptions): Promise<WhatsAppApiResponse>;
  sendButtons(options: SendButtonsOptions): Promise<WhatsAppApiResponse>;
  markAsRead(messageId: string): Promise<WhatsAppApiResponse>;
}

export interface WebhookHandlerConfig {
  verifyToken: string;
  appSecret?: string;
}

export interface MessageContact {
  name?: string;
  waId: string;
}

export interface TextMessage {
  body: string;
}

export interface ImageMessage {
  id: string;
  mimeType: string;
  sha256: string;
  caption?: string;
}

export interface VideoMessage {
  id: string;
  mimeType: string;
  sha256: string;
  caption?: string;
}

export interface DocumentMessage {
  id: string;
  mimeType: string;
  sha256: string;
  filename?: string;
  caption?: string;
}

export interface AudioMessage {
  id: string;
  mimeType: string;
  sha256: string;
}

export interface LocationMessage {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ButtonMessage {
  text: string;
  payload: string;
}

export interface InteractiveButtonReply {
  type: 'button_reply';
  buttonReply: {
    id: string;
    title: string;
  };
}

export interface InteractiveListReply {
  type: 'list_reply';
  listReply: {
    id: string;
    title: string;
    description?: string;
  };
}

export type InteractiveMessage = InteractiveButtonReply | InteractiveListReply;

export interface IncomingMessage {
  messageId: string;
  from: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'contacts' | 'button' | 'interactive';
  phoneNumberId: string;
  displayPhoneNumber: string;
  contact?: MessageContact;
  text?: TextMessage;
  image?: ImageMessage;
  video?: VideoMessage;
  document?: DocumentMessage;
  audio?: AudioMessage;
  location?: LocationMessage;
  contacts?: any[];
  button?: ButtonMessage;
  interactive?: InteractiveMessage;
}

export interface MessageStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipientId: string;
  conversation?: any;
  pricing?: any;
}

export type WebhookData = IncomingMessage | MessageStatus;

export class WebhookHandler {
  constructor(config: WebhookHandlerConfig);
  
  verify(req: any, res: any): void;
  handle(req: any, res: any, callback: (data: WebhookData) => void): void;
  handleMessages(req: any, res: any, callback: (message: IncomingMessage) => void): void;
  handleStatus(req: any, res: any, callback: (status: MessageStatus) => void): void;
}
