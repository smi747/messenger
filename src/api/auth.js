import HTTPTransport from "../framework/HTTPTransport";
import { BaseAPI } from "../framework/BaseAPI";

const chatAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2/auth');

export default class AuthAPI extends BaseAPI {
    signup(data) {
        return chatAPIInstance.post('/signup', {data: data});
    }
    signin(data) {
        return chatAPIInstance.post('/signin', {data: data});
    }
    getUser(data) {
        return chatAPIInstance.get('/user');
    }
    logout(data) {
        return chatAPIInstance.post('/logout');
    }
}
