const METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};

function queryStringify(data) {
    if (typeof data !== "object" || data === null) {
        throw new Error("Data must be a non-null object");
    }

    const keys = Object.keys(data);

    if (keys.length === 0) {
        return "";
    }

    return keys.reduce((result, key, index) => {
        if (data[key] === undefined || data[key] === null) {
            return result;
        }

        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(data[key]);

        const separator = index < keys.length - 1 ? "&" : "";

        return `${result}${encodedKey}=${encodedValue}${separator}`;
    }, "?");
}

class HTTPTransport {
    static BASE_URL = "https://ya-praktikum.tech/api/v2";

    constructor(root) {
        this.root_api = this.constructor.BASE_URL + root;
    }

    get = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: METHODS.GET },
            options.timeout,
        );
    };

    post = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: METHODS.POST },
            options.timeout,
        );
    };

    put = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: METHODS.PUT },
            options.timeout,
        );
    };

    delete = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: METHODS.DELETE },
            options.timeout,
        );
    };

    request = (url, options = {}, timeout = 5000) => {
        const { headers = {}, method, data, responseType } = options;

        return new Promise((resolve, reject) => {
            if (!method) {
                reject(new Error("HTTP method is required"));
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            xhr.open(
                method,
                isGet && data
                    ? `${this.root_api + url}${queryStringify(data)}`
                    : this.root_api + url,
            );
            xhr.withCredentials = true;

            if (responseType) {
                xhr.responseType = responseType;
            }

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let response;

                    if (xhr.responseType) {
                        response = xhr.response;
                    } else {
                        try {
                            const contentType =
                                xhr.getResponseHeader("Content-Type");
                            if (
                                contentType &&
                                contentType.includes("application/json")
                            ) {
                                response = JSON.parse(xhr.responseText);
                            } else {
                                response = xhr.responseText;
                            }
                        } catch (e) {
                            response = xhr.responseText;
                        }
                    }

                    resolve(response);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: xhr.responseText,
                        request: xhr,
                    });
                }
            };

            xhr.onabort = () =>
                reject({
                    reason: "Request aborted",
                    request: xhr,
                });

            xhr.onerror = () =>
                reject({
                    reason: "Network error",
                    request: xhr,
                });

            xhr.timeout = timeout;

            xhr.ontimeout = () =>
                reject({
                    reason: "Request timeout",
                    timeout: timeout,
                    request: xhr,
                });

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else if (typeof data === "object") {
                if (!headers["Content-Type"]) {
                    xhr.setRequestHeader("Content-Type", "application/json");
                }
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send(data);
            }
        });
    };
}

export default HTTPTransport;
