import React, {useCallback, useState} from "react"
import {Form, FormikProps} from "formik"
import {EventForm as EventFormType, Marker as MarkerType} from "../../../data/event/types"
import EventType, {EventTypes} from "../../../constants/EventType"
import {Button, DatePicker, Input, Select} from "antd"
import {useTranslation} from "react-i18next"
import {Map, Marker, TileLayer} from "react-leaflet"
import {IconFA} from "../../Common/IconFA"
import Locker from "../../Common/Locker"
import AvatarPicker from "../../Common/AvatarPicker"
import FeedSelector from "../../Feed/FeedSelector"
import HelperIcon from "../../Common/HelperIcon"
import moment from "moment"

const {RangePicker} = DatePicker
const {TextArea} = Input
const {Option} = Select


const EventForm: React.FC<FormikProps<EventFormType>> = ({values, setFieldValue, handleChange, isSubmitting, isValid}) => {
    const {t} = useTranslation("event")
    const [marker, setMarker] = useState<MarkerType>()

    const handleMarkerChange = useCallback((e: { latlng: MarkerType }) => {
        setMarker(e.latlng)
        setFieldValue("coordinates", e.latlng)
    }, [])

    return (
        <Form className="flex flex-col flex-wrap">
            <div className="flex items-center justify-between mb-3 mr-3">
                <Select defaultValue={EventType.AFTERWORK} onChange={value => setFieldValue("type", value)}>
                    {EventTypes.map(e =>
                        <Option key={e} value={e}>{t(`type.${e}`)}</Option>
                    )}
                </Select>
                <div className="flex items-center">
                    <div>
                        <label className="font-dinotcb mr-2">
                            {t("form.label.published")}
                            <HelperIcon text={t("form.label.published_help")}/>
                        </label>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm"
                            showTime
                            value={moment(values.published)}
                            onChange={date => setFieldValue("published", date ? date.toDate(): new Date() )}
                            bordered={false}
                            placeholder={t("form.placeholder.published")}
                            className="hover:border-indigo-400 block"
                            style={{borderBottom: "1px solid #d9d9d9"}}
                        />
                    </div>
                    <Locker defaultValue={values.closed} onChange={v => setFieldValue("closed", v)}/>
                </div>
            </div>
            <div className="flex flex-wrap justify-between items-end">
                <div className="lg:w-3/5 w-full">
                    <label className="font-dinotcb">{t("form.label.name")}*</label>
                    <Input
                        required
                        name="title"
                        placeholder={t("form.placeholder.title")}
                        value={values.title}
                        onChange={handleChange}
                        bordered={false}
                        className="hover:border-indigo-400"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                    />
                </div>
                <div className="lg:w-2/5 w-full">
                    <label className="font-dinotcb">Dates*</label>
                    <RangePicker
                        className="ml-4"
                        defaultValue={[moment(values.start), moment(values.end)]}
                        showTime={{format: "HH:mm"}}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={t("form.placeholder.range")}
                        onChange={(dates: any) => {
                            setFieldValue("start", dates[0]._d)
                            setFieldValue("end", dates[1]._d)
                        }}
                        bordered={false}
                    />
                </div>
            </div>
            <div className="my-4 w-full">
                <label className="font-dinotcb">{t("form.label.description")}*</label>
                <TextArea
                    required
                    name="description"
                    value={values.description}
                    placeholder={t("form.placeholder.description")}
                    onChange={handleChange}
                    bordered={false}
                    className="hover:border-indigo-400"
                    style={{borderBottom: "1px solid #d9d9d9"}}
                />

            </div>

            <div className="w-full">
                <div className="flex justify-between flex-wrap">
                    <div className="lg:w-40 w-full">
                        <label className="font-dinotcb">{t("form.label.location")}</label>
                        <Input
                            name="location"
                            prefix={<IconFA name="fa-map-marker-alt"/>}
                            placeholder={t("form.placeholder.location")}
                            value={values.location}
                            onChange={handleChange}
                            bordered={false}
                            className="hover:border-indigo-400"
                            style={{borderBottom: "1px solid #d9d9d9"}}
                        />
                    </div>
                    <div className="flex">
                        <div className="w-24 mr-2">
                            <label className="font-dinotcb">{t("form.label.price")}</label>
                            <Input
                                name="price"
                                suffix={<IconFA name="fa-euro-sign"/>}
                                placeholder="80.00"
                                value={values.price}
                                onChange={handleChange}
                                bordered={false}
                                className="hover:border-indigo-400"
                                style={{borderBottom: "1px solid #d9d9d9"}}
                            />
                        </div>
                        <div>
                            <label className="font-dinotcb">{t("form.label.ticket_url")}</label>
                            <Input
                                name="ticketURL"
                                suffix={<IconFA name="fa-external-link-alt"/>}
                                placeholder="linkedin.com/in/pvenard/"
                                value={values.ticketURL}
                                onChange={handleChange}
                                bordered={false}
                                className="hover:border-indigo-400"
                                style={{borderBottom: "1px solid #d9d9d9"}}
                            />
                        </div>
                    </div>
                </div>
                <Map
                    className="mt-5 rounded h-32"
                    center={[48.857, 2.348]}
                    onClick={handleMarkerChange}
                    zoom={12}
                >
                    <TileLayer
                        id="mapbox/streets-v11"
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                        accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                    />
                    {marker && <Marker position={marker}/>}
                </Map>
            </div>
            <div className="flex flex-wrap justify-between items-end mt-2">
                <div className="lg:w-1/2 w-full">
                    <label className="font-dinotcb">{t("form.label.target")}</label>
                    <FeedSelector defaultValues={values.targets} onChange={targets => setFieldValue("targets", targets)}/>
                </div>

                <div className="lg:w-1/2 w-full flex mt-2 justify-between">
                    <AvatarPicker
                        defaultValue={values.club}
                        clubOnly={true}
                        callback={(id) => setFieldValue("club", id)}
                        className="mx-2 w-32 hover:border-indigo-400"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                        placeholder={t("form.placeholder.club")}
                    />
                    <div className="flex items-center">
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<IconFA name="fa-save" type="regular" className="mr-2"/>}
                            disabled={isSubmitting}
                            className={isValid ? "cursor-pointer hover:text-gray-700 rounded" : "cursor-default text-gray-300 rounded"}
                        >
                            Enregistrer
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    )
}
export default EventForm