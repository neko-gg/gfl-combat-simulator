import fs from "fs";
import StcResult from "@app/model/stc/StcResult";

export default class StcReader {
    private offset = 0;
    private readonly stcBuffer: Promise<Buffer>;

    private readFile(stcFile: string): Promise<Buffer> {
        return new Promise<Buffer>(((resolve, reject) => {
            fs.readFile(stcFile, ((err, data) => {
                err ? reject(err) : resolve(data);
            }));
        }));
    }

    constructor(stcFile: string) {
        this.stcBuffer = this.readFile(stcFile);
    }

    skipTo(offset: number): void {
        this.offset = offset;
    }

    async readUInt8(): Promise<number> {
        const buffer = await this.stcBuffer;
        const data = buffer.readUInt8(this.offset);
        this.offset += 1;
        return data;
    }

    async readInt16(): Promise<number> {
        const buffer = await this.stcBuffer;
        const data = buffer.readInt16LE(this.offset);
        this.offset += 2;
        return data;
    }

    async readUInt16(): Promise<number> {
        const buffer = await this.stcBuffer;
        const data = buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return data;
    }

    async readInt32(): Promise<number> {
        const buffer = await this.stcBuffer;
        const data = buffer.readInt32LE(this.offset);
        this.offset += 4;
        return data;
    }

    async readBigInt64(): Promise<bigint> {
        const buffer = await this.stcBuffer;
        const data = buffer.readBigInt64LE(this.offset);
        this.offset += 8;
        return data;
    }

    async readFloat(): Promise<number> {
        const buffer = await this.stcBuffer;
        const data = Number.parseFloat(buffer.readFloatLE(this.offset).toFixed(7));
        this.offset += 4;
        return data;
    }

    async readDouble(): Promise<number> {
        const buffer = await this.stcBuffer;
        const data = buffer.readDoubleLE(this.offset);
        this.offset += 8;
        return data;
    }

    async readString(): Promise<string> {
        this.offset += 1;
        const length = await this.readUInt16();
        const buffer = await this.stcBuffer;
        const data = buffer.toString('utf-8', this.offset, this.offset + length);
        this.offset += length;
        return data;
    }

    async readStcValue(stcCode: number): Promise<number | bigint | string> {
        switch (stcCode) {
            case 1:
                return this.readUInt8();
            case 5:
                return this.readInt32();
            case 8:
                return this.readBigInt64();
            case 9:
                return this.readFloat();
            case 11:
                return this.readString();
        }
    }

    async readStc(): Promise<StcResult> {
        const stcCode = await this.readUInt16();
        await this.readUInt16();

        const totalRows = await this.readUInt16();
        const totalCols = await this.readUInt8();

        const colTypeCodes: number[] = [];
        for (let currentCol = 0; currentCol < totalCols; ++currentCol) {
            const stcTypeCode = await this.readUInt8();
            colTypeCodes.push(stcTypeCode);
        }

        await this.readInt32();
        const dataStartOffset = await this.readInt32();
        this.skipTo(dataStartOffset);

        const body: (number | bigint | string) [][] = [];

        for (let currentRow = 0; currentRow < totalRows; ++currentRow) {
            const row: (number | bigint | string) [] = [];

            for (let currentCol = 0; currentCol < colTypeCodes.length; ++currentCol) {
                const stcTypeCode = colTypeCodes[currentCol];
                const value = await this.readStcValue(stcTypeCode);
                row.push(value);
            }

            body.push(row)
        }

        return {
            code: stcCode,
            totalRows: totalRows,
            totalCols: totalCols,
            body: body
        }
    }

}
