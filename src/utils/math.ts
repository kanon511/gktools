import { PARAMETER } from "@/constants"

export function dictionarySum(dict: { [key: string]: number }) {
    return Object.values(dict).reduce((acc, val) => acc + val, 0);
}

export function parameterSum(dict: { [key: string]: number }) {
    let sum = 0;
    for (const key of PARAMETER.NAMES) {
        if (dict[key] === undefined) {
            return undefined;
        }
        sum += dict[key];
    }
    return sum;
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

export function inversePiecewiseLinearInterpolation(points: [number, number][], y: number): number {
    // 按y升序排序，确保函数单调（若不单调，逆函数可能不唯一）
    const sortedPoints = points.slice().sort((a, b) => a[1] - b[1]);

    // 限制y在边界内
    if (y <= sortedPoints[0][1]) {
        return sortedPoints[0][0];
    } else if (y >= sortedPoints[sortedPoints.length - 1][1]) {
        return sortedPoints[sortedPoints.length - 1][0];
    }

    // 查找 y 所在的区间
    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const [x0, y0] = sortedPoints[i];
        const [x1, y1] = sortedPoints[i + 1];

        if ((y >= y0 && y <= y1) || (y >= y1 && y <= y0)) {
            // 线性插值反推 x
            const t = (y - y0) / (y1 - y0);
            return x0 + t * (x1 - x0);
        }
    }

    throw new Error("未能找到对应的插值区间");
}

export function floor(n: number, epsilon: number = 1e-8) {
    return Math.floor(n + epsilon);
}

export function ceil(n: number, epsilon: number = 1e-8) {
    return Math.ceil(n - epsilon);
}