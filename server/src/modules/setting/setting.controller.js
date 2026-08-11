import { StatusCodes } from "http-status-codes";

import * as services from "./setting.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { SETTING_MESSAGES } from "../../shared/constants/messages/index.js";


export const fetchSettingController = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const setting = await services.fetchSettingService(userId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(SETTING_MESSAGES.SETTING_FETCH_SUCCESS, setting));
});

export const updateSettingController = asyncHandler(async (req, res) => {

    const settingData = req.body;

    const userId = req.user.id;

    const updatedSetting = await services.updateSettingService(userId, settingData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(SETTING_MESSAGES.SETTING_UPDATE_SUCCESS, updatedSetting));
});