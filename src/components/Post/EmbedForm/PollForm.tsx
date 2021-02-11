import React, {useCallback} from "react"
import {Field, FieldArray, useFormikContext} from "formik"
import {FormValues} from "../PostForm"
import {EmbedPollCreation} from "../../../data/post/types"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import {DatePicker, Divider, Switch} from "antd"
import moment from "moment"
import {isPast} from "date-fns"


const PollForm: React.FC = () => {
    const {t} = useTranslation("poll")
    const {values, setFieldValue} = useFormikContext<FormValues>()
    const poll = values.embed as EmbedPollCreation

    const optionValidate = useCallback((value) => {
        let errorMessage
        if (value.length === 0 || value.length > 200) {
            errorMessage = "Field required"
        }
        return errorMessage
    }, [])

    return (
        <div className="w-full">
            <Divider className="m-2"/>
            <div className="flex justify-between">
                <h3 className="font-dinotcb text-gray-700">
                    {t("poll")}
                </h3>
                <IconFA className="cursor-pointer hover:text-gray-400" name="fa-times" onClick={() => setFieldValue("embed", null)}/>
            </div>
            <div className="flex justify-between">
                <Field
                    required
                    placeholder={t("subject")}
                    className="text-gray-700 border-b border-solid border-gray-200 w-full focus:outline-none"
                    style={{maxWidth: "16rem"}}
                    name="embed.data.title"
                />
                <DatePicker
                    format="DD/MM/YYYY HH:mm"
                    showTime
                    value={poll.data.endsAt ? moment(poll.data.endsAt): null}
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
                        {poll.data.choices.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center rounded-lg border border-solid border-gray-200 focus-within:border-indigo-400 focus-within:border-2 w-full py-1 px-2 my-1"
                            >

                                <Field
                                    className="text-gray-700 flex-grow focus:outline-none"
                                    validate={optionValidate}
                                    name={`embed.data.choices.${index}`} placeholder={t("option") + " " + index}
                                />
                                {poll.data.choices.length > 1 && (
                                    <IconFA className="cursor-pointer hover:text-red-400" name="fa-times" onClick={() => arrayHelpers.remove(index)}/>
                                )}
                            </div>

                        ))}
                        <div className="cursor-pointer font-dinot mt-2" onClick={() => arrayHelpers.push("")}>
                            {t("add_choice")} +
                        </div>
                    </div>
                )}
            />
            <div className="flex items-baseline mt-1 mb-2">
                <div className="mx-1">
                    <Switch defaultChecked={poll.data.anonymous} className="mr-2" size="small"/>
                    {t("anonymous_poll")}
                </div>
                <div className="mx-1">
                    <Switch defaultChecked={poll.data.anonymous} className="mr-2" size="small"/>
                    {t("multiple_choice_poll")}
                </div>
            </div>
        </div>
    )
}

export default PollForm