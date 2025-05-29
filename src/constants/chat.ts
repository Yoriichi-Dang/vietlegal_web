const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_HOST}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}`;
const CHAT_BASE_URL = `${BASE_URL}/conversations`;
const CHAT_API = {
  getChats: CHAT_BASE_URL,
  getChat: (id: string) => `${CHAT_BASE_URL}/${id}/messages`,
  getChatIncludeMessages: `${CHAT_BASE_URL}/with-details`,
  createChat: CHAT_BASE_URL,
  updateChat: (id: string) => `${CHAT_BASE_URL}/${id}`,
  deleteChat: (id: string) => `${CHAT_BASE_URL}/${id}`,
  addMessage: (id: string) => `${CHAT_BASE_URL}/${id}/messages`,
  addMessages: (id: string) => `${CHAT_BASE_URL}/${id}/batch-messages`,
};
export default CHAT_API;
