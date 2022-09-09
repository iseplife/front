import { Divider } from "antd"
import ClubSelector from "../../../../components/Club/ClubSelector"
import Textarea from "react-expanding-textarea"
import EventTypeSelector from "./typeselector"
import AddEventTextField from "./textfield"
import FeedSelector from "../../../../components/Feed/FeedSelector"
import { useCallback, useMemo } from "react"
import {FormProvider, useForm, useWatch} from "react-hook-form"
import EventPlaceSelector from "./placeselector"

const AddEventPage = () => {

    const methods = useForm()
    const {register, setValue, getValues, formState, control, handleSubmit} = methods

    register("targets")

    const targets = useWatch({
        control,
        name: "targets",
        defaultValue: []
    })

    const setTargets = useCallback((targets: number[]) => setValue("targets", targets), [])
    
    const printValues = (a: any) => {
        console.log(a)
        console.log(formState.isValid)
        console.log(formState.errors)
        console.log(getValues())
    }
    console.log(formState.errors)

    return <form onSubmit={handleSubmit(printValues)}>
        <FormProvider {...methods} >
            <div className="container mx-auto px-4 mb-4">
                <div className="w-full sm:w-[70%] lg:w-1/2 mx-auto">
                    {/* <Divider className="text-gray-700 text-lg" orientation="left">Créer un événement</Divider> */}
                    <div className="w-full bg-white rounded-lg shadow-sm px-5 py-2 mt-2 grid gap-3">
                        <div>
                            <Divider className="text-gray-700 text-lg my-1" orientation="left">Informations générales</Divider>
                        </div>
                        <div className="flex">
                            <div className="relative w-[65%]">
                                <AddEventTextField title="Nom de l'événement">
                                    <input {...register("title", {required: true, maxLength: 30})} type="text" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="Métamorphoz" />
                                </AddEventTextField>
                            </div>
                            <ClubSelector className="ml-1.5 w-[35%]" />
                        </div>
                        <AddEventTextField title="Audience (facultatif)" className="relative">
                            <FeedSelector
                                defaultValues={targets}
                                onChange={setTargets}
                                className="pt-5 border border-neutral-200 rounded-lg"
                            />
                        </AddEventTextField>
                        <div className="grid grid-cols-2 gap-3">
                            <AddEventTextField title="Début de l'événement">
                                <input {...register("startsAt", {required: true})} type="datetime-local" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                            </AddEventTextField>
                            <AddEventTextField title="Fin de l'événement">
                                <input {...register("endsAt", {required: true})} type="datetime-local" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                            </AddEventTextField>
                        </div>
                        <div className="flex justify-center">
                            <EventTypeSelector className="w-[70%]" />
                        </div>
                        <div>
                            <Divider className="text-gray-700 text-lg my-1" orientation="left">Informations complémentaires</Divider>
                        </div>
                        <AddEventTextField title="Description">
                            <Textarea {...register("description", {required: true, maxLength: 500})} className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full resize-none max-h-[50vh]" placeholder="Cet événement va être super !" />
                        </AddEventTextField>
                        <AddEventTextField title="Position (facultatif)" className="-mt-1 rounded-lg border border-neutral-200 p-2 flex flex-col">
                            <EventPlaceSelector />
                        </AddEventTextField>
                        <div>
                            <Divider className="text-gray-700 text-lg my-1" orientation="left">Billetterie (facultatif)</Divider>
                        </div>
                        <div className="flex relative w-full">
                            <AddEventTextField title="Prix (€)" className="mr-3 w-[30%] relative">
                                <input {...register("price", {min: 0, max: 9999})} type="number" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="0" />
                            </AddEventTextField>
                            <AddEventTextField title="Lien" className="w-[70%] relative">
                                <input {...register("ticketURL")} type="url" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="https://google.com" />
                            </AddEventTextField>
                        </div>
                        <button onClick={printValues} className="w-1/2 px-3 py-2 rounded-md bg-indigo-400 shadow-sm text-center mx-auto font-semibold text-white mt-3">Créer</button>
                    </div>
                </div>
            </div>
        </FormProvider>
    </form>
}

export default AddEventPage