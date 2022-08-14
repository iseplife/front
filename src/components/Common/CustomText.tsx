import { Divider } from "antd"

interface CustomTextProps {
    description: string
    seeAll?: boolean
    descLengthThrottle?: number
    phone?: boolean
}
const CustomText: React.FC<CustomTextProps> = ({description, seeAll = true, descLengthThrottle = 0, phone}) => {
    let totalLength = 0
    return <> {
        description.split("\n").map((val, index, array) => {
            if (totalLength >= descLengthThrottle && totalLength) return
    
            if (val == "<spacer>")
                return <Divider className="my-4" />
            
            if (!seeAll && phone) {
                if (totalLength + val.length > descLengthThrottle)
                    val = val.substring(0, descLengthThrottle - totalLength)
                totalLength += val.length
            }
    
            return index && array[index - 1] != "<spacer>" ? <><br /> {val}</> : val
        })
    } </>
}

export default CustomText