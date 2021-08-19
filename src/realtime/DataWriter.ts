class DataWriter {
    protected static textEncoder = new TextEncoder()

    public view: DataView
    protected _index = 0
    constructor(buffer: ArrayBuffer) {
        this.view = new DataView(buffer)
    }
    get index(): number {
        return this._index
    }

    /**
     * Écris un boolean (8 bits)
     */
    writeBoolean(bool: boolean) {
        this.view.setInt8(this._index++, bool ? 1 : 0)
    }
    /**
     * Écris un signed byte (8 bits, -128 -> 127)
     */
    writeByte(number: number) {
        this.view.setInt8(this._index++, number)
    }
    /**
     * Écris un unsigned byte (8 bits, 0 -> 255).
     */
    writeUByte(number: number) {
        this.view.setUint8(this._index++, number)
    }

    /**
     * Écris un signed short (16 bits, -32768 -> 32767)
     */
    writeShort(number: number) {
        this.view.setInt16(this._addToIndex(2), number)
    }
    /**
     * Écris un unsigned short (16 bits, 0 -> 65535)
     */
    writeUShort(number: number) {
        this.view.setUint16(this._addToIndex(2), number)
    }
    /**
     * Écris un signed int (32 bits, -2147483648 -> 2147483647)
     */
    writeInt(number: number) {
        this.view.setInt32(this._addToIndex(4), number)
    }
    /**
     * Écris un signed int (32 bits, 0 -> 4294967295)
     */
    writeUInt(number: number) {
        this.view.setUint32(this._addToIndex(4), number)
    }

    writeDouble(number: number) {
        this.view.setFloat64(this._addToIndex(8), number)
    }
    writeFloat(number: number) {
        this.view.setFloat32(this._addToIndex(4), number)
    }
    writeString(str: string) {
        const data = DataWriter.textEncoder.encode(str)
        this.writeUShort(data.byteLength)
        for (let index = data.byteLength; index--;)
            this.view.setUint8(this._index + index, data[index])
        this._index += data.byteLength
    }


    public getAndReset(): ArrayBuffer {
        try {
            return this.view.buffer.slice(0, this._index)
        } finally {
            this._index = 0
        }
    }

    protected _addToIndex(add: number): number {
        return (this._index += add) - add
    }
}

export default DataWriter