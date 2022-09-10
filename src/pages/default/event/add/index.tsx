import { Divider } from "antd"
import ClubSelector from "../../../../components/Club/ClubSelector"
import Textarea from "react-expanding-textarea"
import EventTypeSelector from "./typeselector"
import AddEventTextField from "./textfield"
import FeedSelector from "../../../../components/Feed/FeedSelector"
import { useCallback } from "react"
import {FormProvider, useForm, useWatch} from "react-hook-form"
import EventPlaceSelector from "./placeselector"
import { useTranslation } from "react-i18next"
import { createEvent, editEvent } from "../../../../data/event"
import { EventForm } from "../../../../data/event/types"
import { useHistory } from "react-router"
import { entityPreloader } from "../../../../components/Optimization/EntityPreloader"
import { eventsManager } from "../../../../datamanager/EventsManager"
import { isAfter } from "date-fns"


interface AddEventPageProps {
    defaultValues?: {[key: string]: any}
    eventId?: number
}

const AddEventPage: React.FC<AddEventPageProps> = ({defaultValues, eventId}) => {
    const {t} = useTranslation("event")
    const history = useHistory()
    const methods = useForm({
        defaultValues
    })
    const {register, setValue, getValues, formState, control, handleSubmit} = methods

    register("targets")

    const targets = useWatch({
        control,
        name: "targets"
    })

    const setTargets = useCallback((targets: number[]) => setValue("targets", targets), [])
    
    const printValues = useCallback((values: any) => {
        if (values.startsAt && !formState.errors.length){
            const formattedValues: EventForm = {
                type: values.type,
                title: values.title,
                description: values.description,
                closed: values.closed,
                startsAt: new Date(values.startsAt),
                endsAt: new Date(values.endsAt),
                club: values.club,
                published: new Date(values.published) ?? new Date(),
                targets: values.targets,
                location: values.location,
                price: values.price,
                ticketURL: values.ticketURL,
                coordinates: values.coordinates,
            }
            console.log(values)
            if (eventId)
                editEvent(eventId, formattedValues).then(res => {
                    if (res.status === 200){
                        entityPreloader.invalidate(res.data.id)
                        eventsManager.initData()
                        history.push(`/event/${res.data.id}`)
                    }
                })
            else
                createEvent(formattedValues).then(res => {
                    if (res.status === 200)
                        history.push(`/event/${res.data.id}`)
                })
        }
    }, [eventId])
    const endDateValidation = useCallback((date: Date) => {
        return isAfter(date, getValues().startsAt)
    }, [])

    return <form onSubmit={handleSubmit(printValues)}>
        <FormProvider {...methods} >
            <div className="container mx-auto px-4 mb-4">
                <div className="w-full sm:w-[70%] lg:w-1/2 mx-auto">
                    <div className="w-full bg-white rounded-lg shadow-sm px-5 py-2 mt-2 grid gap-3">
                        <div>
                            <Divider className="text-gray-700 text-lg my-1" orientation="left">{t("form.titles.general")}</Divider>
                        </div>
                        <div className="flex">
                            <div className="relative w-[65%]">
                                <AddEventTextField title={t("form.label.name")}>
                                    <input {...register("title", {required: true, maxLength: 30})} type="text" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder={t("form.placeholder.title")} />
                                </AddEventTextField>
                            </div>
                            <ClubSelector className="ml-1.5 w-[35%]" />
                        </div>
                        <AddEventTextField title={t("form.label.target")} className="relative">
                            <FeedSelector
                                defaultValues={targets}
                                onChange={setTargets}
                                className="pt-5 border border-neutral-200 rounded-lg"
                            />
                        </AddEventTextField>
                        <div className="grid grid-cols-2 gap-3">
                            <AddEventTextField title={t("form.label.range.start")}>
                                <input {...register("startsAt", {required: true, valueAsDate: true})} type="datetime-local" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                            </AddEventTextField>
                            <AddEventTextField title={t("form.label.range.end")}>
                                <input {...register("endsAt", {required: true, valueAsDate: true, validate: endDateValidation})} type="datetime-local" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                            </AddEventTextField>
                        </div>
                        <div className="flex justify-center">
                            <EventTypeSelector className="w-[70%]" />
                        </div>
                        <div>
                            <Divider className="text-gray-700 text-lg my-1" orientation="left">{t("form.titles.additional")}</Divider>
                        </div>
                        <AddEventTextField title={t("form.label.description")}>
                            <Textarea {...register("description", {required: true})} className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full resize-none max-h-[50vh]" placeholder={t("form.placeholder.description")} />
                        </AddEventTextField>
                        <AddEventTextField title={t("form.label.location")} className="-mt-1 rounded-lg border border-neutral-200 p-2 flex flex-col">
                            <EventPlaceSelector />
                        </AddEventTextField>
                        <div>
                            <Divider className="text-gray-700 text-lg my-1" orientation="left">{t("form.titles.tickets")}</Divider>
                        </div>
                        <div className="flex relative w-full">
                            <AddEventTextField title={t("form.label.price")} className="mr-3 w-[30%] relative">
                                <input {...register("price", {min: 0, max: 9999})} type="number" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="0" />
                            </AddEventTextField>
                            <AddEventTextField title={t("form.label.ticket_url")} className="w-[70%] relative">
                                <input {...register("ticketURL")} type="url" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" placeholder="https://google.com" />
                            </AddEventTextField>
                        </div>
                        <button onClick={printValues} className="w-1/2 px-3 py-2 rounded-md bg-indigo-400 shadow-sm text-center mx-auto font-semibold text-white mt-3">{t(defaultValues ? "form.edit": "form.create")}</button>
                    </div>
                </div>
            </div>
        </FormProvider>
    </form>
}

export default AddEventPage