import React, {useCallback} from "react"
import {Field, FieldArray, useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {EmbedForm, EmbedPollForm} from "../../../../data/post/types"
import {useTranslation} from "react-i18next"
import {DatePicker, Switch} from "antd"
import moment from "moment"
import {isPast} from "date-fns"
import {faAdd, faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"


const PollForm: React.FC = () => {
    const {t} = useTranslation("poll")
    const {values, setFieldValue} = useFormikContext<PostFormValues<EmbedForm>>()
    const poll = (values.embed as EmbedPollForm).data

    const optionValidation = useCallback((value: any) => {
        if(value)
            return (value.length === 0 || value.length > 200) ? "Field required" : null
    }, [])

    return (
        <div className="w-full rounded-xl border border-neutral-200 px-3 py-0.5">
            <div className="flex items-center">
                <FontAwesomeIcon
                    className="text-red-800 cursor-pointer hover:text-red-400"
                    icon={faTimes}
                    onClick={() => setFieldValue("embed", undefined)}
                />
                <div className="text-gray-500 font-bold ml-2">
                    {t("poll")}
                </div>
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
                    <div className="flex flex-col p-1 overflow-y-auto" style={{maxHeight: "10rem"}}>
                        {poll.choices.map((choice, index) => <div className="flex items-center">
                            <div
                                key={index}
                                className={`flex items-center rounded-lg border border-solid border-gray-200 focus-within:border-indigo-400 focus-within:border-2 w-full py-1 px-2 my-1
                                          text-neutral-700 ${choice.id && "bg-neutral-100 opacity-70"}`}
                            >

                                <Field
                                    className={`flex-grow focus:outline-none bg-transparent ${choice.id && "cursor-not-allowed"}`}
                                    validate={optionValidation}
                                    disabled={choice.id}
                                    name={`embed.data.choices.${index}.content`} placeholder={t("option") + " " + (index + 1)}
                                />
                                {poll.choices.length > 2 && (
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        onClick={() => arrayHelpers.remove(index)}
                                        className="cursor-pointer hover:text-red-400"
                                    />
                                )}
                            </div>
                            {poll.choices.length < 10 &&
                                <FontAwesomeIcon
                                    icon={faAdd}
                                    className={`ml-2 p-2 hover:bg-neutral-200/70 transition-colors rounded-full cursor-pointer ${index != poll.choices.length - 1 && "invisible"}`}
                                    onClick={() => arrayHelpers.push("")}
                                />
                            }
                        </div>)}
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
