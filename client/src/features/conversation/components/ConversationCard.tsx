import { useNavigate } from "react-router-dom";
import { ImageWithSkeleton } from "@/components/media";
import { timeConverter } from "@/utils";
import type { Conversation } from "../type";


interface ConversationCardProps {
  conversation: Conversation;
};


const ConversationCard = ({ conversation }: ConversationCardProps) => {

  const navigate = useNavigate();

  const { _id, participant, lastMessage, unreadMessages } = conversation;

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${participant.username}`);
  };

  return (
    <article onClick={() => navigate(`/conversations/${_id}`)} className="flex w-full items-center gap-3 border-b border-secondary-200 px-4 py-3 transition-colors hover:bg-secondary-50 cursor-pointer">

      <button
        type="button"
        onClick={navigateToProfile}
        className="cursor-pointer"
      >
        <ImageWithSkeleton
          src={participant.avatar}
          alt={participant.displayName}
          className="h-full w-full rounded-full object-cover"
          containerClassName="h-12 w-12 shrink-0 rounded-full bg-secondary-100"
        />
      </button>

      {/* Main info container */}
      <div className="min-w-0 flex-1">

        {/* name and time */}
        <div className="flex items-center justify-between gap-3">
          <h2 onClick={navigateToProfile} className="truncate text-sm font-semibold text-secondary-950 hover:underline">
            {participant.displayName}
          </h2>
          <time
            dateTime={lastMessage.createdAt}
            title={new Date(lastMessage.createdAt).toLocaleString()}
            className="shrink-0 text-xs text-secondary-500"
          >
            {timeConverter(lastMessage.createdAt)}
          </time>
        </div>

        {/* last message content and unread message count */}
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="truncate text-sm text-secondary-600">
            {lastMessage.content}
          </p>
          {
            unreadMessages > 0 && (
              <span
                aria-label={`${unreadMessages} unread messages`}
                className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary-800 px-1.5 text-xs font-semibold text-white"
              >
                {unreadMessages <= 99 ? unreadMessages : '99+'}
              </span>
            )
          }
        </div>
      </div>
    </article>
  );
};

export default ConversationCard;
