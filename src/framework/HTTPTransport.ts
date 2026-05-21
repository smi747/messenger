enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

type RequestData =
    | Record<string, unknown>
    | FormData
    | Document
    | XMLHttpRequestBodyInit
    | null
    | undefined;

interface RequestOptions {
    headers?: Record<string, string>;
    method?: METHODS;
    data?: RequestData;
    timeout?: number;
    responseType?: XMLHttpRequestResponseType;
}

interface HTTPError {
    status?: number;
    statusText?: string;
    response?: string;
    reason?: string;
    timeout?: number;
    request: XMLHttpRequest;
}

function queryStringify(data: Record<string, unknown>): string {
    if (typeof data !== "object" || data === null) {
        throw new Error("Data must be a non-null object");
    }

    const params = Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    String(value),
                )}`,
        );

    return params.length ? `?${params.join("&")}` : "";
}

class HTTPTransport {
    static BASE_URL = "https://ya-praktikum.tech/api/v2";

    private root_api: string;

    constructor(root: string) {
        this.root_api = `${HTTPTransport.BASE_URL}${root}`;
    }

    get<T = unknown>(
        url: string,
        options: Omit<RequestOptions, "method"> = {},
    ): Promise<T> {
        return this.request<T>(
            url,
            { ...options, method: METHODS.GET },
            options.timeout,
        );
    }

    post<T = unknown>(
        url: string,
        options: Omit<RequestOptions, "method"> = {},
    ): Promise<T> {
        return this.request<T>(
            url,
            { ...options, method: METHODS.POST },
            options.timeout,
        );
    }

    put<T = unknown>(
        url: string,
        options: Omit<RequestOptions, "method"> = {},
    ): Promise<T> {
        return this.request<T>(
            url,
            { ...options, method: METHODS.PUT },
            options.timeout,
        );
    }

    delete<T = unknown>(
        url: string,
        options: Omit<RequestOptions, "method"> = {},
    ): Promise<T> {
        return this.request<T>(
            url,
            { ...options, method: METHODS.DELETE },
            options.timeout,
        );
    }

    request<T = unknown>(
        url: string,
        options: RequestOptions = {},
        timeout = 5000,
    ): Promise<T> {
        const {
            headers = {},
            method,
            data,
            responseType,
        } = options;

        return new Promise<T>((resolve, reject) => {
            if (!method) {
                reject(new Error("HTTP method is required"));
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            const requestUrl =
                isGet &&
                data &&
                typeof data === "object" &&
                !(data instanceof FormData)
                    ? `${this.root_api}${url}${queryStringify(
                          data as Record<string, unknown>,
                      )}`
                    : `${this.root_api}${url}`;

            xhr.open(method, requestUrl);
            xhr.withCredentials = true;

            if (responseType) {
                xhr.responseType = responseType;
            }

            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let response: unknown;

                    if (xhr.responseType && xhr.responseType !== "text") {
                        response = xhr.response;
                    } else {
                        try {
                            const contentType =
                                xhr.getResponseHeader("Content-Type");

                            if (
                                contentType?.includes("application/json")
                            ) {
                                response = JSON.parse(xhr.responseText);
                            } else {
                                response = xhr.responseText;
                            }
                        } catch {
                            response = xhr.responseText;
                        }
                    }

                    resolve(response as T);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: xhr.responseText,
                        request: xhr,
                    } as HTTPError);
                }
            };

            xhr.onabort = () =>
                reject({
                    reason: "Request aborted",
                    request: xhr,
                } as HTTPError);

            xhr.onerror = () =>
                reject({
                    reason: "Network error",
                    request: xhr,
                } as HTTPError);

            xhr.timeout = timeout;

            xhr.ontimeout = () =>
                reject({
                    reason: "Request timeout",
                    timeout,
                    request: xhr,
                } as HTTPError);

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else if (typeof data === "object") {
                if (!headers["Content-Type"]) {
                    xhr.setRequestHeader(
                        "Content-Type",
                        "application/json",
                    );
                }

                xhr.send(JSON.stringify(data));
            } else {
                xhr.send(data);
            }
        });
    }
}

export default HTTPTransport;
