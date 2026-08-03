const encodeCursor = (cursor) => {

    if (!cursor) {
        return null;
    };

    return Buffer.from(JSON.stringify(cursor)).toString("base64url");
};

export default encodeCursor;