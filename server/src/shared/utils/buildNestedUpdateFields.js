const buildNestedUpdateFields = (data, parentName) => {

    const pairObj = {};

    Object.entries(data).forEach(([key, value]) => {
        pairObj[`${parentName}.${key}`] = value;
    });

    return pairObj;
};

export default buildNestedUpdateFields;