const serverApiConfig = {
  host: `${process.env.NEXT_PUBLIC_BACKEND_API_HOST}`,
  port: `${process.env.NEXT_PUBLIC_BACKEND_API_PORT}`,
};
const serverApiBaseUrl = `${serverApiConfig.host}:${serverApiConfig.port}`;
const profileApiUrl = {
  getProfile: `/users/profile`,
  updateProfile: `/users/profile`,
  changePassword: `/users/change-password`,
};
const authApiUrl = {
  login: `/auth/login`,
  register: `/auth/register`,
  refreshToken: `/auth/refresh`,
  googleLogin: `/auth/callback/google`,
};
const modelApiUrl = {
  getModel: `/ai-models`,
};
const getConversationMessageApiUrl = (id?: string): Record<string, string> => {
  if (!id) {
    return {
      getAllConversations: `/conversations`,
      createConversation: `/conversations`,
    };
  }
  return {
    getAllMessages: `/conversations/${id}/messages`,
    createMessage: `/conversations/${id}/messages`,
    updateConversation: `/conversations/${id}`,
    deleteConversation: `/conversations/${id}`,
  };
};

export {
  profileApiUrl,
  authApiUrl,
  serverApiBaseUrl,
  modelApiUrl,
  getConversationMessageApiUrl,
};
