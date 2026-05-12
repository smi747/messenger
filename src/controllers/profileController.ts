import UsersAPI from "../api/users.js";
import Store from "../framework/Store";
import Router from "../router.js";

interface parsedAPIError {
    reason: string;
}

interface APIError {
    status: string,
    statusText: string,
    response: string,
    request: string,
}

type ProfileData = {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

type PasswordData = {
    oldPassword: string;
    newPassword: string;
    newPassword_: string;
};

type ApiResult = {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

const profileAPI = new UsersAPI();

export default class ProfileController {
    async setProfile(data: ProfileData): Promise<void> {
        try {
            const result: ApiResult = (await profileAPI.setProfile(
                data,
            )) as ApiResult;

            if (result.id) {
                Store.setState("userInfo", result);
            }
        } catch {
            Router.go("/500");
        }
    }

    async setPassword(data: PasswordData): Promise<void> {
        const { oldPassword, newPassword, newPassword_ } = data;
        if (oldPassword && (newPassword !== newPassword_)) {
            Store.setState("formError", "Пароли не совпадают!");
            return;
        }

        try {
            const result: string = (await profileAPI.setPassword(
                data,
            )) as string;

            if (result === "OK") {
                Store.setState("formError", "Пароль успешно изменен!");
            }
        } catch (error: unknown) {
            Store.setState("formError", JSON.parse((error as APIError).response).reason as parsedAPIError);
        }
    }

    async setAvatar(data: FormData): Promise<void> {
        try {
            const result: ApiResult = (await profileAPI.setAvatar(
                data,
            )) as ApiResult;

            if (result.id) {
                Store.setState("userInfo", result);
                Store.setState("profileState", {
                    noEdit: true,
                    passwordEdit: false,
                    dataEdit: false,
                });
            }
        } catch (error: unknown) {
            Store.setState("formError", JSON.parse((error as APIError).response).reason as parsedAPIError);
        }
    }

    profileState(n: Record<string, boolean>): void {
        Store.setState("profileState", n);
    }
}
