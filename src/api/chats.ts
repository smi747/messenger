import HTTPTransport from "../framework/HTTPTransport.js";
import { BaseAPI } from "../framework/BaseAPI";

type GetChatsRequest = Record<string, unknown>;

type AddChatRequest = {
    title: string;
};

type UserRequest = {
    users: number[];
    chatId: number;
};

const chatAPIInstance = new HTTPTransport(
    "https://ya-praktikum.tech/api/v2/chats",
);

export default class ChatAPI extends BaseAPI {
    getChats(data?: GetChatsRequest): Promise<unknown> {
        return chatAPIInstance.get("/", { data });
    }

    addChat(data: AddChatRequest): Promise<unknown> {
        return chatAPIInstance.post("/", { data });
    }

    deleteUser(data: UserRequest): Promise<unknown> {
        return chatAPIInstance.delete("/users", { data });
    }

    addUser(data: UserRequest): Promise<unknown> {
        return chatAPIInstance.put("/users", { data });
    }
}
