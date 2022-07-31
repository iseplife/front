import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSFeedPostPollChoiceUpdate implements PacketIn {

    postId!: number
    choices: {id: number, votes: number}[] = []

    read(dataReader: DataReader): void {
        this.postId = dataReader.readUInt()
        for (let i = dataReader.readShort(); i--;)
            this.choices.push({
                id: dataReader.readUInt(),
                votes: dataReader.readUInt(),
            })
    }

}
