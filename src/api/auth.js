import HTTPTransport from "../framework/HTTPTransport";
import { BaseAPI } from "../framework/BaseAPI";

const chatAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2/auth');

export default class AuthAPI extends BaseAPI {
    signup(data) {
        return chatAPIInstance.post('/', {data: data});
    }
    signin(data) {
        return chatAPIInstance.post('/', {data: data});
    }
    getUser(data) {
        return chatAPIInstance.get('/user', {data: data});
    }
    logout(data) {
        return chatAPIInstance.post('/logout', {data: data});
    }
}
