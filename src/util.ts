import {useLocation} from "react-router-dom"

export const getEducationYear = (graduationYear: number): string => {
	const educationsYear = ["Diplomé", "A3", "A2", "A1", "SUP", "SUP"]

	const date = new Date()
	// If we are only at the beginning of the year (before July, 8th) we still are in previous school's year
	const schoolYear = date.getMonth() < 8 ? date.getFullYear() - 1 : date.getFullYear()

	return educationsYear[Math.min(Math.max(0, graduationYear - schoolYear), educationsYear.length - 1)]
}

export const useQuery = () => new URLSearchParams(useLocation().search)

