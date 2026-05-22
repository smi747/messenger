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

type User = {
    "id": number,
    "first_name": string,
    "second_name": string,
    "display_name": string,
    "login": string,
    "avatar": string,
    "role": string
};

type Users ={
    users: User[];
}

type DeleteResponse = {
  "userId": number;
  "result": {
    "id": number;
    "title": string;
    "avatar": string;
    "created_by": number;
  };
};

type ApiResult = {
    [key: string]: unknown;
};

type GetChatsRequest = Record<string, unknown>;

type AddChatRequest = {
    title: string;
};

type DeleteChatRequest = {
    chatId: number;
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

    async deleteChat(data: DeleteChatRequest): Promise<void> {
        try {
            const result: DeleteResponse = (await chatlistAPI.deleteChat(data)) as DeleteResponse;
            if (result?.result) {
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

    async setAvatar(data: FormData): Promise<void> {
            try {
                const result: ApiResult = (await chatlistAPI.setAvatar(
                    data,
                )) as ApiResult;

                if (result.id) {
                    await this.getChats();
                }
            } catch {
        }
    }

    async getUsers(data:string): Promise<void> {
            try {
                const result = (await chatlistAPI.getUsers(data)) as Users;

                if (result) {
                    Store.setState("users", result);
                }
            } catch {
                Router.go("/500");
            }
        }
}
