import HTTPTransport from "../framework/HTTPTransport.js";
const chatAPIInstance = new HTTPTransport(
    "/auth",
);

export async function isLoggedIn(): Promise<boolean> {
    try {
        const result = await chatAPIInstance.get("/user");
        if (result.id) {
            return true;
        }
    } catch {
        return false;
    }
    return false;
}
