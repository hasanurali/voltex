import mongoose from "mongoose";

const convertToObjectId = (id = null) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    };

    return null;
};

export default convertToObjectId;