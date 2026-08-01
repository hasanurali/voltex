const decodeCursor = (cursor) => {

    if (!cursor) {
        return null;
    };

    try {

        return JSON.parse(
            Buffer.from(cursor, 'base64url').toString('utf-8')
        );

    } catch (error) {

        return null;

    };
};

export default decodeCursor;