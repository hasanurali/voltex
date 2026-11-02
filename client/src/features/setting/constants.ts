import { Eye, MessageCircle } from "lucide-react";

export const privacySettingItems = [
    {
        key: "profileVisibility",
        label: "Profile Visibility",
        description: "Control who can discover your profile and see your posts",
        icon: Eye,
        options: [
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
        ]
    },
    {
        key: "messagePermission",
        label: "Message Permission",
        description: "Specify who is allowed to send you direct messages",
        icon: MessageCircle,
        options: [
            { value: "everyone", label: "Everyone" },
            { value: "follower", label: "Followers" },
        ]
    }
] as const;

export const notificationSettingItems = [
    { key: "likes", label: "Likes" },
    { key: "comments", label: "Comments" },
    { key: "follows", label: "Follows / New Followers" }
] as const;