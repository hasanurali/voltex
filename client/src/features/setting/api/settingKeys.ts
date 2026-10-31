export const settingKeys = {
    all: ['setting'] as const,
    userSetting: () => [...settingKeys.all, 'user'] as const
} as const;