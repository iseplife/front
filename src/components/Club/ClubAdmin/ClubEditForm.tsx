import React, {useContext} from "react"
import {useFormik} from "formik"
import {ClubForm} from "../../../data/club/types"
import {Button, Input, message} from "antd"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"
import {updateClub} from "../../../data/club"
import {ClubContext, ClubContextWithClub} from "../../../context/club/context"
import {ClubActionType} from "../../../context/club/action"
import {faCircleNotch, faLink} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebookF, faInstagram} from "@fortawesome/free-brands-svg-icons"
import {faSave} from "@fortawesome/free-solid-svg-icons"

const {TextArea} = Input


const ClubEditForm: React.FC = () => {
    const {t} = useTranslation(["club", "common"])
    const {state: { club }, dispatch} = useContext(ClubContext) as ClubContextWithClub

    const formik = useFormik<ClubForm>({
        initialValues: {
            name: club.name,
            description: club.description,
            facebook: club.facebook,
            instagram: club.instagram,
            website: club.website
        },
        onSubmit: (values, {setSubmitting}) => {
            updateClub(club.id, values).then(res => {
                if (res.status === 200) {
                    setSubmitting(false)
                    
                    message.success(t("common:update_item.complete"))
                    dispatch({type: ClubActionType.UPDATE_CLUB, payload: res.data})
                }
            })
        }
    })

    return (
        <form className="flex flex-col rounded-lg shadow bg-white p-3 m-2" onSubmit={formik.handleSubmit}>
            <h3 className="font-bold text-xl text-gray-600 self-start">Edition information</h3>
            <div className="flex flex-grow p-2">
                <div className="w-2/3">
                    <label>{t("form.name")}</label>
                    <Input
                        name="name"
                        placeholder="Nom"
                        required
                        bordered={false}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className="hover:border-[#fe9200]"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                    />
                </div>
                <div className="w-1/3">
                    <label>{t("form.creation")}</label>
                    <Input
                        type="date"
                        bordered={false}
                        disabled
                        value={format(new Date(club.creation), "yyyy-MM-dd")}
                    />
                </div>
            </div>

            <div className="mt-3">
                <label>{t("form.description")}</label>
                <TextArea
                    name="description"
                    placeholder="Décrivez l'association en quelques lignes..."
                    required
                    maxLength={2000}
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    bordered={false}
                    className="hover:border-[#fe9200]"
                    style={{borderBottom: "1px solid #d9d9d9"}}
                />
            </div>

            <div className="flex mt-5 mb-3">
                <div className="flex-1 mx-1">
                    <label>{t("form.website")}</label>
                    <Input
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        placeholder="www.internet.com"
                        suffix={<FontAwesomeIcon icon={faLink}/>}
                        bordered={false}
                        className="hover:border-[#fe9200]"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                    />
                </div>
                <div className="flex-1 mx-1">
                    <label>Instagram</label>
                    <Input
                        name="instagram"
                        value={formik.values.instagram}
                        onChange={formik.handleChange}
                        placeholder="Instagram"
                        suffix={<FontAwesomeIcon icon={faInstagram}/>}
                        bordered={false}
                        className="hover:border-[#fe9200]"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                    />
                </div>
                <div className="flex-1 mx-1">
                    <label>Facebook</label>
                    <Input
                        name="facebook"
                        value={formik.values.facebook}
                        onChange={formik.handleChange}
                        placeholder="Facebook"
                        suffix={<FontAwesomeIcon icon={faFacebookF}/>}
                        bordered={false}
                        className="hover:border-[#fe9200]"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                    />
                </div>
            </div>

            <div className="w-full flex justify-end mt-2">

                <button type="submit" disabled={formik.isSubmitting} className="py-2 items-center cursor-pointer rounded-full flex bg-[#fe9200] hover:bg-opacity-90 px-5 text-white">
                    {formik.isSubmitting ?
                        <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2"/> :
                        <FontAwesomeIcon icon={faSave} className="mr-2"/>
                    }
                    {t("common:save")}
                </button>
            </div>
        </form>
    )
}
export default ClubEditForm
