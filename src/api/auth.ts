import HTTPTransport from "../framework/HTTPTransport.js";
import { BaseAPI } from "../framework/BaseAPI";

type SignupData = {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
};

type SigninData = {
    login: string;
    password: string;
};

const chatAPIInstance = new HTTPTransport(
    "https://ya-praktikum.tech/api/v2/auth",
);

export default class AuthAPI extends BaseAPI {
    signup(data: SignupData): Promise<unknown> {
        return chatAPIInstance.post("/signup", { data });
    }

    signin(data: SigninData): Promise<unknown> {
        return chatAPIInstance.post("/signin", { data });
    }

    getUser(): Promise<unknown> {
        return chatAPIInstance.get("/user");
    }

    logout(): Promise<unknown> {
        return chatAPIInstance.post("/logout");
    }
}
