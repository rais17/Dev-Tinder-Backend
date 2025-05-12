const USER_ALLOWED_VALUE = [
    "firstName",
    "lastName",
    "email",
    "password",
    "gender",
    "age",
    "photoUrl",
    "phoneNumber",
    "about",
    "skills"
];

const PROFILE_UPDATE_ALLOWED_VALUE = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photoUrl",
    "phoneNumber",
    "about",
    "skills"
];

const REQUIRED_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "password",
]

const CHANGE_PASSWORD_ALLOWED_VALUE = [
    "email",
    "password",
    "changePassword"
]

module.exports = {
    USER_ALLOWED_VALUE,
    REQUIRED_FIELDS,
    PROFILE_UPDATE_ALLOWED_VALUE,
    CHANGE_PASSWORD_ALLOWED_VALUE
}