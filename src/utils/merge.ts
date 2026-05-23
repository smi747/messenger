type Indexed<T = unknown> = {
    [key: string]: T;
};

function merge(lhs: Indexed, rhs: Indexed): Indexed {
    for (const p in rhs) {
        if (!rhs.hasOwnProperty(p)) {
            continue;
        }

        try {
            if ((rhs[p] as Indexed).constructor === Object) {
                rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
            } else {
                lhs[p] = rhs[p];
            }
        } catch {
            lhs[p] = rhs[p];
        }
    }

    return lhs;
}

export default merge;
