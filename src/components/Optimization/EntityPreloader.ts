import ExpiryMap from "expiry-map"
import { EventPreview } from "../../data/event/types"
import { SearchItem } from "../../data/searchbar/types"

export default class EntityPreloader {
    private cache = new ExpiryMap(1000 * 60 * 10)

    public set(key: number, value: any) {
        this.cache.set(key, value)
    }

    public get<T, Z>(key: number) {
        return this.cache.get(key) as (Partial<T & Z & SearchItem> & (T | Z | SearchItem)) | undefined
    }
    public getEvent(key: number) {
        return this.cache.get(key) as EventPreview | undefined
    }
}

const entityPreloader = new EntityPreloader()

export { entityPreloader }