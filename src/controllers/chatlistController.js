import ChatsAPI from "../api/chats";
import Store from "../framework/Store";
import Router from "../router";

const chatlistAPI = new ChatsAPI();

export default class ChatlistController {
    async getChats(data) {
    try {
      const result = await chatlistAPI.getChats(data);
      if (result) {
        Store.setState('chatList', result);
      }
    } catch (error) {
        Router.go('/500');
    }
  }
}
