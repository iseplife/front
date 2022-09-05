import { Divider } from "antd"
import ClubSelector from "../../../../components/Club/ClubSelector"
import Textarea from "react-expanding-textarea"
import EventTypeSelector from "./typeselector"
import AddEventTextField from "./textfield"
import { MapContainer, TileLayer } from "react-leaflet"
import FeedSelector from "../../../../components/Feed/FeedSelector"
import { useCallback } from "react"

const AddEventPage = () => {

    const setTargets = useCallback(() => console.log, [])
    
    return <div className="container mx-auto px-4">
        <div className="w-full sm:w-[70%] lg:w-1/2 mx-auto">
            {/* <Divider className="text-gray-700 text-lg" orientation="left">Créer un événement</Divider> */}
            <div className="w-full bg-white rounded-lg shadow-sm px-5 py-2 mt-2 grid gap-3">
                <div>
                    <Divider className="text-gray-700 text-lg my-1" orientation="left">Informations générales</Divider>
                </div>
                <div className="flex">
                    <div className="relative w-[65%]">
                        <AddEventTextField title="Nom de l'événement">
                            <input type="text" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="Métamorphoz" />
                        </AddEventTextField>
                    </div>
                    <ClubSelector className="ml-1.5 w-[35%]" />
                </div>
                <AddEventTextField title="Audience (facultatif)" className="relative">
                    <FeedSelector
                        defaultValues={[]}
                        onChange={setTargets}
                        className="pt-5 border border-neutral-200 rounded-lg"
                    />
                </AddEventTextField>
                <div className="grid grid-cols-2 gap-3">
                    <AddEventTextField title="Début de l'événement">
                        <input type="datetime-local" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                    </AddEventTextField>
                    <AddEventTextField title="Fin de l'événement">
                        <input type="datetime-local" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                    </AddEventTextField>
                </div>
                <div className="flex justify-center">
                    <EventTypeSelector className="w-[70%]" />
                </div>
                <div>
                    <Divider className="text-gray-700 text-lg my-1" orientation="left">Informations complémentaires</Divider>
                </div>
                <AddEventTextField title="Description">
                    <Textarea className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full resize-none max-h-[50vh]" placeholder="Cet événement va être super !" />
                </AddEventTextField>
                <AddEventTextField title="Position (facultatif)" className="-mt-1 rounded-lg border border-neutral-200 overflow-hidden p-2 flex flex-col">
                    <>
                        <input type="text" className="rounded-lg mt-3 px-2 py-2 w-full mb-1 flex-shrink-0" placeholder="Rechercher une adresse..." />
                        <MapContainer
                            center={[48.857, 2.348]}
                            zoom={15}
                            className="w-full rounded-lg h-44 sm:h-52"
                        >
                            <TileLayer
                                id="mapbox/streets-v11"
                                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                                accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                            />
                            {/* {marker && <Marker position={marker}/>} */}
                        </MapContainer>
                        <input type="text" className="rounded-lg border border-neutral-200 p-3 py-2 mt-2 w-full" placeholder="Nom du lieu (facultatif)" />
                    </>
                </AddEventTextField>
                <div>
                    <Divider className="text-gray-700 text-lg my-1" orientation="left">Billetterie (facultatif)</Divider>
                </div>
                <div className="flex relative w-full">
                    <AddEventTextField title="Prix (€)" className="mr-3 w-[30%] relative">
                        <input type="number" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="0" />
                    </AddEventTextField>
                    <AddEventTextField title="Lien" className="w-[70%] relative">
                        <input type="url" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="https://google.com" />
                    </AddEventTextField>
                </div>
            </div>
        </div>
    </div>
}

export default AddEventPage