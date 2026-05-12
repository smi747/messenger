import AuthAPI from "../api/auth";
import Store from "../framework/Store";
import Router from "../router.js";

const loginAPI = new AuthAPI();

interface parsedAPIError {
    reason: string;
}

interface APIError {
    status: string,
    statusText: string,
    response: string,
    request: string,
}

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

type User = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  email: string;
  phone: string;
};



export default class LoginController {
    async login(data: SigninData): Promise<void> {
        try {
            const result = await loginAPI.signin(data);

            if (result === "OK") {
                Router.go("/messenger");
                Store.setState("userInfo", result);
            }
        } catch (error: unknown) {
            const parsed: parsedAPIError = JSON.parse((error as APIError).response);
            Store.setState("loginError", parsed.reason);
        }
    }

    async logout(): Promise<void> {
        try {
            const result = await loginAPI.logout();

            if (result === "OK") {
                Router.go("/");
            }
        } catch {
            Router.go("/");
        }
    }

    async signup(data: SignupData): Promise<void> {
        try {
            const result = (await loginAPI.signup(data)) as User;

            if (result.id) {
                Store.setState("userInfo", result);
                Router.go("/messenger");
            }
        } catch (error: unknown) {
            const parsed: parsedAPIError = JSON.parse((error as APIError).response);
            Store.setState("loginError", parsed.reason);
        }
    }

    async getUser(): Promise<void> {
        try {
            const result = (await loginAPI.getUser()) as User;

            if (result.id) {
                Store.setState("userInfo", result);
            }
        } catch (error: unknown) {
            const parsed: parsedAPIError = JSON.parse((error as APIError).response);
            Store.setState("loginError", parsed.reason);
        }
    }
}
