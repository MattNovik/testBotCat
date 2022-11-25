export const sortFn = sortBy => {
    const chunkRgx = /(_+)|([0-9]+)|([^0-9_]+)/g;

    return (a, b) => {
        const cur = String(a[sortBy]);
        const next = String(b[sortBy]);

        const ax = [];
        const bx = [];

        cur.replace(chunkRgx, (_, $1, $2, $3) => {
            ax.push([$1 || '0', $2 || Infinity, $3 || '']);
        });

        next.replace(chunkRgx, (_, $1, $2, $3) => {
            bx.push([$1 || '0', $2 || Infinity, $3 || '']);
        });

        while (ax.length && bx.length) {
            const an = ax.shift();
            const bn = bx.shift();
            const nn = an[0].localeCompare(bn[0]) || an[1] - bn[1] || an[2].localeCompare(bn[2]);

            if (nn) return nn;
        }

        return ax.length - bx.length;
    };
};

export default (data, sortBy, sortType = 'asc') => {
    if (!sortBy || !sortType) return data;

    const newData = Array.from(data).sort(sortFn(sortBy));

    if (sortType === 'desc') {
        return newData.reverse();
    }

    return newData;
};
