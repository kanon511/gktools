export function dictionarySum(dict: { [key: string]: number }) {
    return Object.values(dict).reduce((acc, val) => acc + val, 0);
}

export function piecewiseLinearInterpolation(points: [number, number][], x: number): number {
    // 按x排序，确保从小到大排列
    const sortedPoints = points.slice().sort((a, b) => a[0] - b[0]);

    // 限制x在边界内
    if (x <= sortedPoints[0][0]) {
        x = sortedPoints[0][0];
    } else if (x >= sortedPoints[sortedPoints.length - 1][0]) {
        x = sortedPoints[sortedPoints.length - 1][0];
    }

    // 查找x所在的区间
    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const [x0, y0] = sortedPoints[i];
        const [x1, y1] = sortedPoints[i + 1];

        if (x >= x0 && x <= x1) {
            // 在线段(x0, y0) 和 (x1, y1)之间进行线性插值
            const t = (x - x0) / (x1 - x0);
            return y0 + t * (y1 - y0);
        }
    }

    throw new Error("未能找到对应的插值区间");
}