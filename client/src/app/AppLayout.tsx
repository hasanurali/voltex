import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileTopBar from './MobileTopBar';
import MobileBottomBar from './MobileBottomBar';
import PostRightSideBar from './RightSideBar';
import { usePostStore } from '@/store';
import { PostCreateSection } from '@/features/post';
import { X } from 'lucide-react';

const AppLayout = () => {

    const isCreatePostModelOpen = usePostStore((state) => state.isCreatePostModelOpen);
    const setIsCreatePostModelOpen = usePostStore((state) => state.setIsCreatePostModelOpen);
    const updatePostId = usePostStore((state) => state.updatePostId);
    const resetPostUpdateData = usePostStore((state) => state.resetPostUpdateData);

    const handleCloseForm = () => {
        setIsCreatePostModelOpen(false);
        if (updatePostId) {
            resetPostUpdateData();
        };
    };

    return (
        <>
            {
                isCreatePostModelOpen && <div onClick={handleCloseForm} className='fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/30 px-2 sm:px-4 py-10'>
                    <div onClick={(e) => e.stopPropagation()} className='h-fit w-full max-w-215 overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/10'>
                        <div className='flex items-center justify-between border-b border-gray-100 px-5 py-3'>
                            <h2 className='text-base font-semibold text-gray-900'>
                                {
                                    updatePostId ?
                                        'Update post'
                                        :
                                        'Create post'
                                }
                            </h2>
                            <button
                                type='button'
                                onClick={handleCloseForm}
                                aria-label='Close post model'
                                className='inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 cursor-pointer'
                            >
                                <X className='h-5 w-5' />
                            </button>
                        </div>
                        <PostCreateSection
                            isModelOpen={isCreatePostModelOpen}
                            setIsModelOpen={setIsCreatePostModelOpen}
                            updatePostId={updatePostId}
                        />
                    </div>
                </div>
            }
            <div className="flex min-h-screen md:h-screen md:overflow-hidden">
                <Sidebar />

                <div className="flex flex-col flex-1 min-w-0 md:min-h-0">
                    <MobileTopBar />

                    <div className="flex flex-1 min-h-0 overflow-hidden">
                        <main className="min-w-0 w-full max-w-215 pb-16 md:overflow-y-auto md:pb-0">
                            <Outlet />
                        </main>

                        <PostRightSideBar />
                    </div>

                    <MobileBottomBar />
                </div>
            </div>
        </>
    );
};

export default AppLayout;