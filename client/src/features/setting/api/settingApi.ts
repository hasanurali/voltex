import { api } from '@/lib';
import type * as settingTypes from '../type.ts';
import { SETTING_ENDPOINTS } from "./settingEndpoints.ts";


export const fetchUserSetting = async (): Promise<settingTypes.Setting> => {

    const res = await api.get<settingTypes.FetchSettingResponse>(SETTING_ENDPOINTS.fetch);

    return res.data.data;
};

export const updateUserSetting = async (payload: settingTypes.UpdateSettingPayload): Promise<settingTypes.Setting> => {

    const res = await api.patch<settingTypes.UpdateSettingResponse>(SETTING_ENDPOINTS.update, payload);

    return res.data.data;
};