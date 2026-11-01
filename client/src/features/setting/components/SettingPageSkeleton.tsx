import { Skeleton } from "@/components";

const PRIVACY_ROWS = 2;
const NOTIFICATION_ROWS = 3;

const SettingPageSkeleton = () => {
    return (
        <div role="status" aria-busy="true" aria-label="Loading settings" className="space-y-5" >

            {/* Privacy section */}
            <section>
                <div className="mb-2 flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                </div>

                <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm">
                    {
                        Array.from({ length: PRIVACY_ROWS }).map((_, i) => (
                            <div key={i} className={i > 0 ? "border-t border-secondary-100" : ""}>
                                <div className="p-3 sm:p-4">

                                    {/* Header icon, label and description */}
                                    <div className="mb-3 flex items-center gap-2.5">
                                        <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                                        <div className="min-w-0 space-y-1.5">
                                            <Skeleton className="h-3 w-28" />
                                            <Skeleton className="h-2.5 w-52 max-w-full" />
                                        </div>
                                    </div>

                                    {/* Select */}
                                    <Skeleton className="h-8.5 w-full rounded-lg" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>

            {/* Notifications section */}
            <section>
                <div className="mb-2 flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm">
                    {
                        Array.from({ length: NOTIFICATION_ROWS }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex min-h-11 items-center justify-between gap-3 px-3 py-2.5 sm:px-4 ${i > 0 ? "border-t border-secondary-100" : ""
                                    }`}
                            >
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-5 w-9 shrink-0 rounded-full!" />
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    );
};

export default SettingPageSkeleton;