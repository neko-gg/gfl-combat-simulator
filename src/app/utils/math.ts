function parseFloat(number: number) {
    return Number.parseFloat(number.toFixed(7));
}

export function floor(number: number): number {
    return Math.floor(parseFloat(number));
}


export function ceil(number: number): number {
    return Math.ceil(parseFloat(number));
}

export function round(number: number): number {
    return Math.round(parseFloat(number));
}
