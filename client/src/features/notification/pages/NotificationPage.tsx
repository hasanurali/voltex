import { useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";
import TopBar from "@/app/TopBar";
import NotificationCard from "../components/NotificationCard";
import { useFetchNotifications } from "../hooks/useFetchNotifications";
import { Button, SentinelLoadingItem } from "@/components";
import { useMarkNotificationAsRead } from "../hooks/useMarkNotificationAsRead";
import { useMarkAllNotificationsAsRead } from "../hooks/useMarkAllNotificationsAsRead";

const NotificationPage = () => {

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending: isFetchNotificationPending, isError: isFetchNotificationError } = useFetchNotifications();
  const notifications = data?.flatMap(page => page.notifications) ?? [];
  const unreadCount = data?.[0].unreadCount ?? 0;

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {

      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      };

    }, { threshold: 0.1 });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    };

    return () => {

      if (currentTarget) {

        observer.unobserve(currentTarget);
      };
    };
  }, [hasNextPage, isFetchingNextPage]);

  const { mutate: markNotificationAsReadMutate } = useMarkNotificationAsRead();
  const { mutate: markAllNotificationsAsReadMutate } = useMarkAllNotificationsAsRead();

  return (
    <>
      <TopBar>
        <span className="flex justify-between items-center">
          Notification

          {
            unreadCount > 0 && (
              <Button
                onClick={() => markAllNotificationsAsReadMutate()}
                variant="ghost"
                type="button"
                className="text-xs text-secondary-600 flex items-center gap-2 p-3 rounded-full! cursor-pointer hover:bg-secondary-100"
              >
                <CheckCheck size={14} />
                Mark all as read
              </Button>
            )
          }
        </span>
      </TopBar>

      {/* Notifications container */}
      <section className="relative">

        {
          unreadCount > 0 && (
            <Button
              onClick={() => markAllNotificationsAsReadMutate()}
              size="sm"
              variant="primary"
              type="button"
              className="fixed bottom-20 right-4 z-10 md:hidden shrink-0 rounded-full! px-3 py-2 text-sm font-semibold text-primary-950 hover:bg-primary-100"
            >
              <CheckCheck size={16} aria-hidden="true" />
              <span>Mark all as read</span>
            </Button>
          )
        }

        {
          !isFetchNotificationPending && !isFetchNotificationError && notifications.length === 0 && (
            <p className="pt-50 text-center text-sm text-secondary-500">
              No notifications yet.
            </p>
          )
        }

        {
          notifications.map(notification => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onOpen={() => markNotificationAsReadMutate(notification)}
            />
          ))
        }

        {
          !isFetchNotificationPending && (
            <SentinelLoadingItem
              ref={observerTarget}
              hasNextPage={hasNextPage}
              hasItems={notifications.length > 0}
              isFetchingNextPage={isFetchingNextPage}
            />
          )
        }
      </section>
    </>
  )
};

export default NotificationPage;