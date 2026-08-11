import { body } from "express-validator";

import { PROFILE_VISIBILITY, MESSAGE_PERMISSION } from "../../shared/constants/enums/index.js";

export const updateSettingValidation = [

    // Privacy
    body("privacy")
        .optional()
        .isObject()
        .withMessage("Privacy must be an object"),

    // Profile Visibility
    body("privacy.profileVisibility")
        .optional()
        .isIn([PROFILE_VISIBILITY.PUBLIC, PROFILE_VISIBILITY.PRIVATE])
        .withMessage("Invalid profile visibility"),

    // Message Permission
    body("privacy.messagePermission")
        .optional()
        .isIn([MESSAGE_PERMISSION.EVERYONE, MESSAGE_PERMISSION.FOLLOWER])
        .withMessage("Invalid message permission"),

    // Notifications
    body("notifications")
        .optional()
        .isObject()
        .withMessage("Notifications must be an object"),

    // Like Notifications
    body("notifications.likes")
        .optional()
        .isBoolean()
        .withMessage("Likes notification setting must be a boolean"),

    // Comment Notifications
    body("notifications.comments")
        .optional()
        .isBoolean()
        .withMessage("Comments notification setting must be a boolean"),

    // Follow Notifications
    body("notifications.follows")
        .optional()
        .isBoolean()
        .withMessage("Follows notification setting must be a boolean"),

    // Message Notifications
    body("notifications.messages")
        .optional()
        .isBoolean()
        .withMessage("Messages notification setting must be a boolean")
];