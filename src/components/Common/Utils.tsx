import {Student} from "../../data/student";

export class Utils {

    static randomBackgroundColors = () => {
        let colors: string[] = ["gray", "red", "orange", "yellow", "green", "teal", "bule", "indigo", "purple", "pink"];
        let opacities: number[] = [300, 400, 500, 600];
        let randomColor: string = colors[Math.floor(Math.random() * colors.length)];
        let randomOpacity: number = opacities[Math.floor(Math.random() * opacities.length)];
        return `bg-${randomColor}-${randomOpacity}`;
    };

    static getInitials = (student: Student) => {
        return (student.firstName.substring(0, 1) + student.lastName.substring(0, 1)).toUpperCase();
    };
}