const whitelistInput = (inputObject, allowedFields) => {

    const sanitizedData = {};

    for (const key of allowedFields) {
        if (inputObject[key] !== undefined) {
            sanitizedData[key] = inputObject[key];
        }
    }

    return sanitizedData;
};

export default whitelistInput;