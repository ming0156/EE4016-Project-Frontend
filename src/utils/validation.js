import * as Yup from 'yup';
import i18n from "../i18n";

const Validation = {};

Validation.required = () => Yup.string().nullable().trim().required(i18n.t('Validation.Required'));

// just choose one to input, not both
Validation.requiredCustomMessage = ({ msg_id, msg }) => Yup.string().nullable().trim().required(msg_id ? i18n.t(msg_id) : msg);

Validation.email = () => Yup.string()
    .matches(/^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, i18n.t('Validation.InvalidEmailFormat')).required(i18n.t('Validation.RequireEmail'));

const passwd = (requireMsgId) => {
    return Yup.string()
        .required(i18n.t(requireMsgId))
        .min(8, i18n.t('Validation.PasswordTooShort'))
        .matches(/[a-z]/, i18n.t('Validation.PasswordRequireLowercase'))
        .matches(/[A-Z]/, i18n.t('Validation.PasswordRequireUppercase'))
        .matches(/[0-9]/, i18n.t('Validation.PasswordRequireDigit'))
        .matches(/[\W_]/, i18n.t('Validation.PasswordRequireSymbol'));
}
Validation.password = () => passwd('Validation.RequirePassword');
Validation.newPassword = () => passwd('Validation.RequireNewPassword')

Validation.isNum = () => Yup.string().nullable().trim().required(i18n.t('Validation.Required')).matches(/^[0-9]*$/, i18n.t('Validation.RequireDigit'));

Validation.isCoupon = () => Yup.string().nullable().trim().required(i18n.t('Validation.Required')).matches(/C[0-9]*$/, i18n.t('Validation.RequireCoupon'));

Validation.confirmPassword = () => Yup.string()
    .oneOf([Yup.ref('password'), null, Yup.ref('password') == null, Yup.ref('password').length === 0], i18n.t('Validation.ConfirmPasswordNotMatch'))
    .when('password', {
        is: (password) => (password != null && password.length > 0),
        then: Yup.string().required(i18n.t('Validation.RequireConfirmPassword'))
    });

Validation.role = () => Yup.string()
    .required(i18n.t('Validation.RequireRole'));

Validation.oldPassword = () => Yup.string()
    .required(i18n.t('Validation.RequireOldPassword'));

export default Validation;