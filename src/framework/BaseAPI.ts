export abstract class BaseAPI {
    // На случай, если забудете переопределить метод — TS сам выдаст ошибку
    create(_data?: unknown): Promise<unknown> {
        throw new Error('Not implemented');
    };

    request(_data?: unknown): Promise<unknown> {
        throw new Error('Not implemented');
    };

    update(_data?: unknown): Promise<unknown> {
        throw new Error('Not implemented');
    };

    delete(_data?: unknown): Promise<unknown> {
        throw new Error('Not implemented');
    };
}
