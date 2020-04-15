import {Student} from "../../data/student/types"

export class Utils {

    static randomBackgroundColors = () => {
    	const colors: string[] = ["gray", "red", "orange", "yellow", "green", "teal", "bule", "indigo", "purple", "pink"]
    	const opacities: number[] = [300, 400, 500, 600]
    	const randomColor: string = colors[Math.floor(Math.random() * colors.length)]
    	const randomOpacity: number = opacities[Math.floor(Math.random() * opacities.length)]
    	return `bg-${randomColor}-${randomOpacity}`
    };

    static getInitials = (name: string) => {
        return name.split(" ").map(s => s.charAt(0).toUpperCase()).join(" ");
    };

}