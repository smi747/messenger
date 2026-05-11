import HTTPTransport from "../framework/HTTPTransport";
const chatAPIInstance = new HTTPTransport(
    "https://ya-praktikum.tech/api/v2/auth",
);

export async function isLoggedIn() {
    try {
        const result = await chatAPIInstance.get("/user");
        if (result.id) {
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}
