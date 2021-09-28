class DataReader {
    private static textDecoder = new TextDecoder()

    public view: DataView
    private _index = 0
    constructor(public buffer: ArrayBuffer) {
        this.view = new DataView(buffer)
    }

    /**
     * Lis un boolean (8 bits).
     */
    public readBoolean(): boolean {
        return this.view.getInt8(this._index++) === 1
    }
    /**
     * Lis un signed byte (8 bits, -128 -> 127).
     */
    public readByte(): number {
        return this.view.getInt8(this._index++)
    }
    /**
     * Lis un unsigned byte (8 bits, 0 -> 255).
     */
    public readUByte(): number {
        return this.view.getUint8(this._index++)
    }

    /**
     * Lis un signed short (16 bits, -32768 -> 32767)
     */
    public readShort(): number {
        return this.view.getInt16(this._addToIndex(2))
    }
    /**
     * Lis un unsigned short (16 bits, 0 -> 65535)
     */
    public readUShort(): number {
        return this.view.getUint16(this._addToIndex(2))
    }

    /**
     * Lis un signed int (32 bits, -2147483648 -> 2147483647)
     */
    public readInt(): number {
        return this.view.getInt32(this._addToIndex(4))
    }
    /**
     * Lis un unsigned int (32 bits, 0 -> 4294967295)
     */
    public readUInt(): number {
        return this.view.getUint32(this._addToIndex(4))
    }

    public readFloat(): number {
        return this.view.getFloat32(this._addToIndex(4))
    }
    public readDouble(): number {
        return this.view.getFloat64(this._addToIndex(8))
    }

    public readArray(length: number): ArrayBuffer {
        return this.view.buffer.slice(this._index, this._index += length)
    }

    /**
     * Lis une chaîne de caractère (longueure maximum : 65535)
     */
    public readString(): string {
        const length = this.readUShort()
        const data = new Int8Array(this.view.buffer.slice(this._index, this._index += length))
        return DataReader.textDecoder.decode(data)
    }

    get length(): number {
        return this.view.byteLength
    }
    get index(): number {
        return this._index
    }
    set index(index: number) {
        this._index = index
    }

    public canRead(): boolean {
        return this.index < this.length
    }



    private _addToIndex(add: number): number {
        return (this._index += add) - add
    }
}

export default DataReader