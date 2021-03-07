export default interface StcResult {
    code: number;
    totalCols: number;
    totalRows: number;
    body: (number | bigint | string)[][]
}
