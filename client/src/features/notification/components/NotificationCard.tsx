import { useNavigate } from "react-router-dom";
import { EllipsisVertical, Play, Trash2 } from "lucide-react";
import { ImageWithSkeleton } from "@/components/media";
import { timeConverter } from "@/utils";
import type { Notification } from "../type";
import { NOTIFICATION_CONFIG } from "../constants";
import { createPortal } from "react-dom";
import { ConfirmDialog } from "@/components";
import { useState } from "react";
import { useDeleteNotification } from "../hooks/useDeleteNotification";


interface NotificationCardProps {
  notification: Notification;
  onOpen?: (notification: Notification) => void;
};


const NotificationCard = ({ notification, onOpen }: NotificationCardProps) => {

  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isDeleteNotificationModelOpen, setIsDeleteNotificationModelOpen] = useState(false);

  const navigate = useNavigate();

  const { triggeredBy, type, metadata, isRead, createdAt } = notification;
  const { text, icon: Icon, badgeClassName } = NOTIFICATION_CONFIG[type];

  const isCommentType = type === "comment-like" || type === "comment-reply";
  const previewText = isCommentType ? metadata?.comment?.content : metadata?.post?.content;
  const postMedia = type === "follow" ? undefined : metadata?.post?.media;

  const handleOpen = () => {

    if (onOpen) {
      onOpen(notification);
    };

    if (type === "follow") {
      navigate(`/profile/${triggeredBy.username}`);
      return;
    };

    const postId = isCommentType ? metadata?.comment?.post : metadata?.post?._id;
    if (postId) {
      navigate(`/posts/${postId}`);
    };
  };

  const { mutate: deleteNotificationMutate } = useDeleteNotification();
  const handleDeleteNotification = () => {
    deleteNotificationMutate(notification);
  };

  return (
    <div
      onClick={handleOpen}
      className={`flex w-full items-start gap-3 border-b border-secondary-200 px-3 py-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-800 cursor-pointer sm:px-4 ${isRead ? "bg-white hover:bg-[#f9f9f9]" : "bg-sky-50/70 hover:bg-sky-50"} relative`}
    >

      {/* Avatar with notification type badge */}
      <div className="relative shrink-0">
        <ImageWithSkeleton
          src={triggeredBy.avatar}
          alt={triggeredBy.displayName}
          className="h-full w-full rounded-full object-cover"
          containerClassName="h-11 w-11 rounded-full"
        />
        <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white ring-2 ring-white ${badgeClassName}`}>
          <Icon aria-hidden="true" className={`h-3 w-3 ${type.endsWith("like") ? "fill-current" : ""}`} />
        </span>
      </div>

      {/* Notification info */}
      <div className="min-w-0 flex-1">
        <p className="wrap-break-word text-sm text-secondary-800">
          <span className="font-bold text-secondary-950">{triggeredBy.displayName}</span>
          {" "}
          {text}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          {
            !isRead && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold leading-4 text-sky-800 ring-1 ring-inset ring-sky-200">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                Unread
              </span>
            )
          }
          <time
            dateTime={createdAt}
            title={new Date(createdAt).toLocaleString()}
            className="text-xs text-secondary-500"
          >
            {timeConverter(createdAt)}
          </time>
        </div>

        {
          previewText && (
            <p className="h-1/2 mt-2 line-clamp-2 wrap-break-word text-sm text-secondary-500">
              {
                previewText.length === 60 ?
                  `${previewText}...`
                  :
                  previewText
              }
            </p>
          )
        }
      </div>

      {/* Post media thumbnail */}
      {
        postMedia && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary-100 sm:h-14 sm:w-14">
            {
              postMedia.mediaType === "image" ? (
                <img src={postMedia.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-secondary-500">
                  <Play aria-hidden="true" className="h-5 w-5 fill-current" />
                </span>
              )
            }
          </div>
        )
      }

      {/* Notification option */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsNotificationMenuOpen(true);
        }}
        type="button"
        aria-label="Notification options"
        aria-haspopup="true"
        className="cursor-pointer"
      >
        <EllipsisVertical aria-hidden="true" color="gray" size={20} />
      </button>

      {/* Notification menu */}
      {
        isNotificationMenuOpen && (
          <div onClick={(e) => e.stopPropagation()} className="absolute z-20 top-4 right-3 w-36 h-fit overflow-hidden rounded-md border border-secondary-100 bg-white shadow-2xl">
            <button
              onClick={() => {
                setIsNotificationMenuOpen(false);
                setIsDeleteNotificationModelOpen(true);
              }}
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 focus-visible:bg-red-50 focus-visible:outline-none cursor-pointer"
            >
              <Trash2 size={16} aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        )
      }

      {
        createPortal(
          <>

            {/* Notification menu overlay */}
            {
              isNotificationMenuOpen && <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationMenuOpen(false);
                }}
                aria-hidden="true"
                className="absolute z-10 inset-0 bg-transparent"></div>
            }

            {/* Confirm post delete model */}
            <ConfirmDialog
              isOpen={isDeleteNotificationModelOpen}
              title="Delete this notification?"
              description="This action can't be undone. Are you sure you want to delete this notification?"
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={() => {
                handleDeleteNotification();
                setIsDeleteNotificationModelOpen(false);
              }}
              onCancel={() => setIsDeleteNotificationModelOpen(false)}
            />
          </>,
          document.body
        )
      }
    </div>
  );
};

export default NotificationCard;