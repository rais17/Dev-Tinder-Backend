const validator = require("validator");

const validateRequest = (userObj, USER_ALLOWED_VALUE, REQUIRED_FIELDS=[], rqField = false) => {

    if (!userObj) throw new Error("Empty Request")
    
    // 1. Check for extra/unallowed fields
    if (!Object.keys(userObj).every((key) => USER_ALLOWED_VALUE.includes(key))) {
        throw new Error("Invalid field(s) provided");
    }

    // 2. Check for missing required fields
  if (rqField && REQUIRED_FIELDS.length > 0) {
        const missingFields = REQUIRED_FIELDS.filter((field) => !(field in userObj));
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
        }
    }

  // 3. Check empty values for ALL PROVIDED FIELDS (including optional ones)
  for (const [key, value] of Object.entries(userObj)) {
    if (!value) throw new Error(`Field '${key}' cannot be empty`);
  }
};

const validatePasswordRequest = (userObject, CHANGE_PASSWORD_ALLOWED_VALUE) => {

    const { changePassword } = userObject;
    validateRequest(userObject, CHANGE_PASSWORD_ALLOWED_VALUE, CHANGE_PASSWORD_ALLOWED_VALUE, true);
  
  
}

module.exports = {
  validateRequest,
  validatePasswordRequest
};
