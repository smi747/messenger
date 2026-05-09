import HTTPTransport from "../framework/HTTPTransport";
import { BaseAPI } from "../framework/BaseAPI";

const chatAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2/users');

export default class AuthAPI extends BaseAPI {
    setProfile(data) {
        return chatAPIInstance.put('/profile', {data: data});
    }
    setAvatar(data) {
        return chatAPIInstance.put('/profile/avatar', {data: data});
    }
    setPassword(data) {
        return chatAPIInstance.put('/password', {data: data});
    }
    searchUsers(data) {
        return chatAPIInstance.post('/search', {data: data});
    }
}
