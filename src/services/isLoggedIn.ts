import HTTPTransport from "../framework/HTTPTransport.js";
const chatAPIInstance = new HTTPTransport(
    "/auth",
);

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

export async function isLoggedIn(): Promise<boolean> {
    try {
        const result = await chatAPIInstance.get("/user") as User;
        if (result.id) {
            return true;
        }
    } catch {
        return false;
    }
    return false;
}
