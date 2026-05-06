import merge from "./merge";

type Indexed<T = any> = {
    [key in string]: T;
};

function set(object: Indexed, path: string, value: unknown): Indexed {
    if (typeof object !== 'object' || object === null) {
        return object;
    }

    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }

    const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
        [key]: acc,
    }), value as any);
    return merge(object as Indexed, result);
}

export default set
