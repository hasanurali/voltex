import mongoose from "mongoose";

const withTransaction = async (callback) => {

    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            result = await callback(session);
        });

        return result;

    } finally {

        await session.endSession();
    }
};

export default withTransaction;