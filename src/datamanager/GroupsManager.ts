import { getUserGroups } from "../data/group"
import { GroupPreview } from "../data/group/types"

export default class GroupsManager {
    private _groups: GroupPreview[] = []
    get groups() { return this._groups }

    /**
     * Charge tous les groupes de l'étudiant
     */
    public async init() {
        this._groups = (await getUserGroups()).data
    }

    
}