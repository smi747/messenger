import ChatsAPI from "../api/chats.js";
import Store from "../framework/Store";
import Router from "../router.js";

type Chat = {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
    unread_count: number;
    last_message: string;
};

type GetChatsRequest = Record<string, unknown>;

type AddChatRequest = {
    title: string;
};

type UserRequest = {
    users: number[];
    chatId: number;
};

const chatlistAPI = new ChatsAPI();

export default class ChatlistController {
    async getChats(data?: GetChatsRequest): Promise<void> {
        try {
            const result: Chat[] = (await chatlistAPI.getChats(data)) as Chat[];
            if (result) {
                Store.setState("chatList", result);
            }
        } catch {
            Router.go("/500");
        }
    }

    async addChat(data: AddChatRequest): Promise<void> {
        try {
            const result: Chat = (await chatlistAPI.addChat(data)) as Chat;
            if (result?.id) {
                Store.setState("current", null);
                await this.getChats();
            }
        } catch {
            Router.go("/500");
        }
    }

    async addUser(data: UserRequest): Promise<void> {
        try {
            const result: string = (await chatlistAPI.addUser(data)) as string;
            if (result === "OK") {
            }
        } catch {
            Router.go("/500");
        }
    }

    async deleteUser(data: UserRequest): Promise<void> {
        try {
            const result: string = (await chatlistAPI.deleteUser(
                data,
            )) as string;
            if (result === "OK") {
            }
        } catch {
            Router.go("/500");
        }
    }
}
