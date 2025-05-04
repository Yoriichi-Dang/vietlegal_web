import { create } from "zustand";

interface ChatState {
  hasSubmittedFirstMessage: boolean;
  setHasSubmittedFirstMessage: (value: boolean) => void;
  resetChatState: () => void;
}

export const useChatState = create<ChatState>((set) => ({
  hasSubmittedFirstMessage: false,
  setHasSubmittedFirstMessage: (value: boolean) => {
    console.log(
      "[DEBUG - useChatState] Setting hasSubmittedFirstMessage to:",
      value
    );
    set({ hasSubmittedFirstMessage: value });
  },
  resetChatState: () => {
    console.log("[DEBUG - useChatState] Resetting chat state");
    set({ hasSubmittedFirstMessage: false });
  },
}));
