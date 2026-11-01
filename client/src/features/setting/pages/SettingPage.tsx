import { Bell, Shield } from "lucide-react";
import TopBar from "@/app/TopBar";
import { useFetchUserSetting } from "../hooks/useFetchUserSetting";
import { useUpdateUserSetting } from "../hooks/useUpdateUserSetting";
import type { Setting } from "../type";
import NotificationSettingCard from "../components/NotificationSettingCard";
import PrivacySettingCard from "../components/PrivacySettingCard";
import { notificationSettingItems, privacySettingItems } from "../constants";
import SettingPageSkeleton from "../components/SettingPageSkeleton";


const SettingPage = () => {

  const { data: setting, isPending: isSettingPending } = useFetchUserSetting();

  const { mutate: updateSettingMutate, isPending: isUpdateSettingPending } = useUpdateUserSetting();

  const handlePrivacyChange = (key: keyof Setting["privacy"], value: string) => {

    if (isUpdateSettingPending) {
      return;
    };

    if (key === "profileVisibility" && (value === "public" || value === "private")) {
      updateSettingMutate({ privacy: { profileVisibility: value } });
    }
    else if (key === "messagePermission" && (value === "everyone" || value === "follower")) {
      updateSettingMutate({ privacy: { messagePermission: value } });
    };
  };

  const handleNotificationChange = (key: keyof Setting["notifications"], enabled: boolean) => {

    if (isUpdateSettingPending) {
      return;
    };

    updateSettingMutate({ notifications: { [key]: enabled } });
  };

  return (
    <>
      <TopBar>Setting</TopBar>

      <div className="min-h-[calc(100vh-109.6px)] md:min-h-[calc(100vh-64.8px)] bg-[#f7f8fa] p-3 md:p-5">
        <div className="mx-auto max-w-3xl">
          {
            isSettingPending && <SettingPageSkeleton />
          }

          {/* Setting section */}
          {
            setting && (
              <div className="space-y-5">

                {/* Privacy settings section */}
                <section aria-label="Privacy settings">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-primary-950">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Privacy
                    </h2>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm">
                    {
                      privacySettingItems.map((privacyInfo, index) => (
                        <div key={privacyInfo.key} className={index > 0 ? "border-t border-secondary-100" : ""}>
                          <PrivacySettingCard
                            privacyInfo={privacyInfo}
                            value={setting.privacy[privacyInfo.key]}
                            onPrivacyChange={(value) => handlePrivacyChange(privacyInfo.key, value)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </section>

                {/* Notification settings section */}
                <section>
                  <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary-950">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    Notifications
                  </h2>

                  <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm">
                    {
                      notificationSettingItems.map(({ label, key }, i) => (
                        <div key={key} className={`flex min-h-11 items-center justify-between gap-3 px-3 py-2.5 sm:px-4 ${i > 0 ? "border-t border-secondary-100" : ""}`}>
                          <NotificationSettingCard
                            notificationInfo={{ label, key }}
                            isChecked={setting.notifications[key]}
                            onNotificationChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange(key, e.target.checked)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </section>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default SettingPage;