import messageModel from "./message.model.js";

export const createMessage = async (messageData) => {

    const message = await messageModel.create(messageData);

    return messageData;
}