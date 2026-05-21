import HTTPTransport from "../framework/HTTPTransport.js";
import { BaseAPI } from "../framework/BaseAPI";

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

const chatAPIInstance = new HTTPTransport(
    "/chats",
);

export default class ChatAPI extends BaseAPI {
    getChats(data?: GetChatsRequest): Promise<unknown> {
        return chatAPIInstance.get("/", { data });
    }

    addChat(data: AddChatRequest): Promise<unknown> {
        return chatAPIInstance.post("/", { data });
    }

    deleteChat(data: DeleteChatRequest): Promise<unknown> {
        return chatAPIInstance.delete("/", { data });
    }

    deleteUser(data: UserRequest): Promise<unknown> {
        return chatAPIInstance.delete("/users", { data });
    }

    addUser(data: UserRequest): Promise<unknown> {
        return chatAPIInstance.put("/users", { data });
    }

    setAvatar(data: FormData): Promise<unknown> {
        return chatAPIInstance.put("/avatar", { data });
    }

    getUsers(data: string): Promise<unknown> {
        return chatAPIInstance.get("/"+data+"/users");
    }

}
