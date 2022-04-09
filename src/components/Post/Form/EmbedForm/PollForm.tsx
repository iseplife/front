import React, {useCallback} from "react"
import {Field, FieldArray, useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {EmbedForm, EmbedPollForm} from "../../../../data/post/types"
import {useTranslation} from "react-i18next"
import {DatePicker, Switch} from "antd"
import moment from "moment"
import {isPast} from "date-fns"
import {faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"


const PollForm: React.FC = () => {
    const {t} = useTranslation("poll")
    const {values, setFieldValue} = useFormikContext<PostFormValues<EmbedForm>>()
    const poll = (values.embed as EmbedPollForm).data

    const optionValidation = useCallback(value => {
        if(value)
            return (value.length === 0 || value.length > 200) ? "Field required" : null
    }, [])

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-gray-500">
                    {t("poll")}
                </h3>

                <FontAwesomeIcon
                    className="cursor-pointer hover:text-red-400"
                    icon={faTimes}
                    onClick={() => setFieldValue("embed", undefined)}
                />
            </div>
            <div className="flex justify-between">
                <Field
                    required
                    placeholder={t("subject")}
                    className="border-b border-solid border-gray-200 w-full focus:outline-none"
                    style={{maxWidth: "16rem"}}
                    name="embed.data.title"
                />
                <DatePicker
                    format="DD/MM/YYYY HH:mm"
                    showTime
                    value={poll.endsAt ? moment(poll.endsAt): null}
                    disabledDate={c => isPast(c.toDate())}
                    onChange={date => setFieldValue("embed.data.endsAt", date ? date.toDate() : new Date())}
                    bordered={false}
                    placeholder={t("ends_at")}
                    className="hover:border-indigo-400 text-gray-500 border-gray-200"
                    style={{borderBottom: "1px solid #d9d9d9"}}
                />
            </div>


            <FieldArray
                name="embed.data.choices"
                render={arrayHelpers => (
                    <div className="flex flex-col p-3 overflow-y-auto" style={{maxHeight: "10rem"}}>
                        {poll.choices.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center rounded-lg border border-solid border-gray-200 focus-within:border-indigo-400 focus-within:border-2 w-full py-1 px-2 my-1"
                            >

                                <Field
                                    className="text-gray-700 flex-grow focus:outline-none"
                                    validate={optionValidation}
                                    name={`embed.data.choices.${index}.content`} placeholder={t("option") + " " + index}
                                />
                                {poll.choices.length > 1 && (
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        onClick={() => arrayHelpers.remove(index)}
                                        className="cursor-pointer hover:text-red-400"
                                    />
                                )}
                            </div>

                        ))}
                        <div className="cursor-pointer mt-2" onClick={() => arrayHelpers.push("")}>
                            {t("add_choice")} +
                        </div>
                    </div>
                )}
            />
            <div className="flex items-baseline mt-1 mb-2">
                <div className="mx-1">
                    <Switch
                        defaultChecked={poll.anonymous}
                        onChange={value => setFieldValue("embed.data.multiple", value)}
                        className="mr-2"
                        size="small"
                    />
                    {t("anonymous_poll")}
                </div>
                <div className="mx-1">
                    <Switch
                        defaultChecked={poll.multiple}
                        onChange={value => setFieldValue("embed.data.multiple", value)}
                        className="mr-2"
                        size="small"
                    />
                    {t("multiple_choice_poll")}
                </div>
            </div>
        </div>
    )
}

export default PollForm
