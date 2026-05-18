import HTTPTransport from "../framework/HTTPTransport.js";
import { BaseAPI } from "../framework/BaseAPI";

interface ProfileData {
    [key: string]: string;
}

type PasswordData = {
    oldPassword: string;
    newPassword: string;
    newPassword_: string;
};

interface SearchUsersData {
    login: string;
}

const chatAPIInstance = new HTTPTransport(
    "/user",
);

export default class AuthAPI extends BaseAPI {
    setProfile(data: ProfileData): Promise<unknown> {
        return chatAPIInstance.put("/profile", { data });
    }

    setAvatar(data: FormData): Promise<unknown> {
        return chatAPIInstance.put("/profile/avatar", { data });
    }

    setPassword(data: PasswordData): Promise<unknown> {
        return chatAPIInstance.put("/password", { data });
    }

    searchUsers(data: SearchUsersData): Promise<unknown> {
        return chatAPIInstance.post("/search", { data });
    }
}
