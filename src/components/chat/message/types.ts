export interface MessageAttachment {
  name: string;
  contentType: string;
  url: string;
}

export interface MessageActionProps {
  messageId: string;
  content: string;
  index: number;
  onCopy?: (content: string, messageId: string) => void;
  onRegenerate?: (messageIndex: number) => void;
  isRegenerating?: boolean;
  copiedId?: string | null;
}
