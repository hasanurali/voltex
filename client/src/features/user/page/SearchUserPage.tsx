import { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useSearchUser } from "../hooks/useSearchUser";
import UserCard from "../components/UserCard";
import { useAuthStore } from "@/store";
import { SentinelLoadingItem } from "@/components";

const SearchUserPage = () => {

  const [userSearchValue, setUserSearchValue] = useState('');

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSearchUser(userSearchValue);
  const users = data ?? [];

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

  const auth = useAuthStore((state) => state.auth);

  return (
    <div className="@container h-screen overflow-hidden">

      {/* Search bar */}
      <SearchBar onUserSearchValue={setUserSearchValue} />

      {/* Searched User display section */}
      <section className="px-4 @xl:px-10 @2xl:px-15 @3xl:px-20">
        <h1 className="font-bold text-2xl pt-7 pb-3">People</h1>
        <div className="h-[calc(100vh-150px)] flex flex-col pb-3 overflow-hidden overflow-y-auto border border-secondary-100 rounded-xl ">
          {
            users?.map(user => (
              <UserCard key={user._id} user={user} currentUserName={auth?.user.username || null} />
            ))
          }

          {/* Discover and no result text items */}
          <div className="m-auto px-3 flex flex-col items-center">
            {
              !users?.length && (
                userSearchValue ?
                  <>
                    <p className="font-bold text-md sm:text-xl">No results for this search</p>
                    <p className="text-secondary-400 text-sm sm:text-[16px] text-center">Make sure the username or name is spelled correctly</p>
                  </>
                  :
                  <>
                    <p className="font-bold text-md sm:text-xl">Discover People</p>
                    <p className="text-secondary-400 text-sm sm:text-[16px] text-center">Type a name or username in the search bar above to get started</p>
                  </>
              )
            }
          </div>

          {/* Bottom sentinelLoadingItem for intersection observer and loading more user */}
          <SentinelLoadingItem
            ref={observerTarget}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            hasItems={users?.length > 0}
          />
        </div>
      </section>
    </div>
  )
};

export default SearchUserPage;