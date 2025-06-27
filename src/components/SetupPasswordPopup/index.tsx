import React, { useContext } from "react"
import { useFormik } from "formik"
import { message } from "antd"
import { useTranslation } from "react-i18next"
import Modal from "../Common/Modal"
import { changeAlumniPassword } from "../../data/alumni"
import { AppContext } from "../../context/app/context"
import { AppActionType } from "../../context/app/action"

interface PasswordForm {
    password: string
    confirmPassword: string
}

const SetupPasswordPopup: React.FC = () => {
    const { state: { user: { promo } }, dispatch } = useContext(AppContext)
    const { t } = useTranslation("setup-password")

    const formik = useFormik<PasswordForm>({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        validate: (values) => {
            const errors: Partial<PasswordForm> = {}
            
            if (values.password.length < 5)
                errors.password = t("errors.password_too_short")
            else if (values.password !== values.confirmPassword)
                errors.confirmPassword = t("errors.passwords_dont_match")
            
            return errors
        },
        onSubmit: (values, { setSubmitting }) => {
            changeAlumniPassword({ password: values.password })
                .then(() => {
                    message.success(t("success"))
                    dispatch({ type: AppActionType.SET_PASSWORD_SETUP, passwordSetup: true })
                })
                .catch(() => {
                    message.error(t("error"))
                })
                .finally(() => {
                    setSubmitting(false)
                })
        }
    })

    const hasError = formik.values.confirmPassword !== "" && (
        (formik.touched.password && formik.errors.password) || 
        (formik.touched.confirmPassword && formik.errors.confirmPassword)
    )

    const errorMessage = (formik.touched.password && formik.errors.password) || 
                         (formik.touched.confirmPassword && formik.errors.confirmPassword)

    return (
        <Modal
            open={true}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">{promo == new Date().getFullYear() ? t("title_notalumni") : t("title")}</h1>
                    <p className="text-sm text-gray-500 text-center">
                        {t("subtitle")}
                    </p>
                    
                    <div className="w-full mt-4 space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                {t("form.new_password")}
                            </label>
                            <input
                                autoFocus
                                type="password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t("form.new_password_placeholder")}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                {t("form.confirm_password")}
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t("form.confirm_password_placeholder")}
                            />
                        </div>
                        {hasError && (
                            <div className="text-red-500 text-sm mt-2">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                        {t("save")}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default SetupPasswordPopup
