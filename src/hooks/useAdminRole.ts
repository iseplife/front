import {useContext, useMemo} from "react"
import {AppContext, AppContextType} from "../context/app/context"
import {Roles} from "../data/security/types"

export default function useAdminRole(): boolean {
    const {state} = useContext<AppContextType>(AppContext)
    const isAdmin = useMemo(() => state.payload.roles.includes(Roles.ADMIN), [state.payload])

    return isAdmin
}