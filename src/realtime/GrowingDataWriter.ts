import DataWriter from "./DataWriter"

class GrowingDataWriter extends DataWriter {
    private _ensureWritable(size: number) {
        if (this.index + size >= this.view.byteLength) {
            //On se souvient de l'ancien buffer
            let current = this.view

            //On créé le nouveau buffer, deux fois plus grand que l'ancien
            this.view = new DataView(new ArrayBuffer(this.view.byteLength * 2))

            //Enfin, on copie les données de l'ancien buffer dans le nouveau
            new Uint8Array(this.view.buffer).set(new Uint8Array(current.buffer))

            current = null! //OPTI
        }
    }

    /**
     * Écris un boolean (8 bits)
     */
    writeBoolean(bool: boolean) {
        this._ensureWritable(1)
        this.view.setInt8(this._index++, bool ? 1 : 0)
    }
    /**
     * Écris un signed byte (8 bits, -128 -> 127)
     */
    writeByte(number: number) {
        this._ensureWritable(1)
        this.view.setInt8(this._index++, number)
    }
    /**
     * Écris un unsigned byte (8 bits, 0 -> 255).
     */
    writeUByte(number: number) {
        this._ensureWritable(1)
        this.view.setUint8(this._index++, number)
    }

    /**
     * Écris un signed short (16 bits, -32768 -> 32767)
     */
    writeShort(number: number) {
        this._ensureWritable(2)
        this.view.setInt16(this._addToIndex(2), number)
    }
    /**
     * Écris un unsigned short (16 bits, 0 -> 65535)
     */
    writeUShort(number: number) {
        this._ensureWritable(2)
        this.view.setUint16(this._addToIndex(2), number)
    }
    /**
     * Écris un signed int (32 bits, -2147483648 -> 2147483647)
     */
    writeInt(number: number) {
        this._ensureWritable(4)
        this.view.setInt32(this._addToIndex(4), number)
    }
    /**
     * Écris un signed int (32 bits, 0 -> 4294967295)
     */
    writeUInt(number: number) {
        this._ensureWritable(4)
        this.view.setUint32(this._addToIndex(4), number)
    }

    writeDouble(number: number) {
        this._ensureWritable(8)
        this.view.setFloat64(this._addToIndex(8), number)
    }
    writeFloat(number: number) {
        this._ensureWritable(4)
        this.view.setFloat32(this._addToIndex(4), number)
    }
    writeString(str: string) {
        let data = DataWriter.textEncoder.encode(str)
        this.writeUShort(data.byteLength)
        this._ensureWritable(data.byteLength)
        for (let index = data.byteLength; index--;)
            this.view.setUint8(this._index + index, data[index])
        this._index += data.byteLength
    }
}

export default GrowingDataWriter