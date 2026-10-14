import { Heart, MessageCircle, UserPlus, type LucideIcon } from "lucide-react";
import type { TypeEnum } from "./type";

export const NOTIFICATION_CONFIG: Record<TypeEnum, { text: string; icon: LucideIcon; badgeClassName: string }> = {
    "post-like": { text: "liked your post", icon: Heart, badgeClassName: "bg-rose-500" },
    "post-comment": { text: "commented on your post", icon: MessageCircle, badgeClassName: "bg-sky-500" },
    "comment-like": { text: "liked your comment", icon: Heart, badgeClassName: "bg-rose-500" },
    "comment-reply": { text: "replied to your comment", icon: MessageCircle, badgeClassName: "bg-sky-500" },
    "follow": { text: "started following you", icon: UserPlus, badgeClassName: "bg-primary-950" }
};