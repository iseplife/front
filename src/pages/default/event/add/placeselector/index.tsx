import axios from "axios"
import { debounce, throttle } from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import { ExtendedMarker, PlaceResponse, PlaceResponseFeature } from "../../../../../data/event/types"
import RecenterAutomatically from "./RecenterAutomatically"

const GOUV_ADRESSE_ENDPOINT = "https://api-adresse.data.gouv.fr/search/?"

const EventPlaceSelector = () => {
    const {register, setValue} = useFormContext()
    const search = useWatch({
        name: "psb",
    })
    const coordinates = useWatch({
        name: "coordinates",
        defaultValue: []
    })

    const marker = useMemo(() => coordinates?.length ? {
        lat: coordinates[0] as number,
        lng: coordinates[1] as number
    } : undefined, [coordinates])

    register("coordinates")

    const onClick = useCallback((result: PlaceResponseFeature) => {
        setValue("psb", "")
        setValue("coordinates", result.geometry.coordinates.reverse())
    }, [])

    const [results, setResults] = useState([] as {result: PlaceResponseFeature, click: ()=>void}[])

    const searchFunction = useCallback(debounce(async (search: string) => {
        console.log("search "+search)
        const url = GOUV_ADRESSE_ENDPOINT + new URLSearchParams({"q": search, limit: "5"})
        const resp = (await axios.get<PlaceResponse>(url)).data
        setResults(resp.features.map(result => ({result, click: () => onClick(result)})))
    }, 300), [])

    useEffect(() => {
        if(search?.length)
            searchFunction(search)
        else
            setResults([])
    }, [search])

    const MapEventsInjector = () => {
        useMapEvents({
            click: (e: { latlng: ExtendedMarker }) => {
                setValue("coordinates", [e.latlng.lat, e.latlng.lng])
            }
        })
        return null
    }


    return <>
        <div className="relative">
            <input {...register("psb")} type="text" className="rounded-lg mt-3 px-2 py-2 w-full mb-1 flex-shrink-0" placeholder="Rechercher une adresse..." />
            {
                results?.length > 0 && <div className="rounded-lg border border-neutral-200 shadow-xl absolute z-[9999] bg-white -left-5 w-[calc(100%+40px)] sm:w-auto sm:left-auto">
                    {
                        results.map(result => <div onClick={result.click} className="w-full py-2 px-3 border-b border-neutral-200 cursor-pointer hover:bg-neutral-200 transition-colors">
                            {result.result.properties.label}
                        </div>)
                    }
                </div>
            }
        </div>
        <MapContainer
            center={[48.857, 2.348]}
            zoom={14}
            className="w-full rounded-lg h-44 sm:h-52"
        >
            <TileLayer
                id="mapbox/streets-v11"
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
            />
            {marker && <>
                <RecenterAutomatically {...marker} />
                <Marker position={marker}/>
            </>}
            <MapEventsInjector />
        </MapContainer>
        <input type="text" className="rounded-lg border border-neutral-200 p-3 py-2 mt-2 w-full" placeholder="Nom du lieu (facultatif)" />
    </>
}

export default EventPlaceSelector