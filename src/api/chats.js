import HTTPTransport from "../framework/HTTPTransport";
import { BaseAPI } from "../framework/BaseAPI";

const chatAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2/chats');

export default class AuthAPI extends BaseAPI {
    getChats(data) {
        return chatAPIInstance.get('/', {data: data});
    }
    addChat(data) {
        return chatAPIInstance.post('/', {data: data});
    }
    deleteUser(data) {
        return chatAPIInstance.delete('/users', {data: data});
    }
    addUser(data) {
        return chatAPIInstance.put('/users', {data: data});
    }
}
