import { ArrowUpRight, MessageCircle, Search, Sparkles, UsersRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from './routes';

const RightSideBar = () => {

    const navigate = useNavigate();
    const isPeopleSearchPage = useLocation().pathname === ROUTES.searchUser;
    const HeaderIcon = isPeopleSearchPage ? UsersRound : Sparkles;

    return (
        <aside className='sticky top-0 hidden h-full min-w-80 flex-[1_1_320px] self-start overflow-y-auto border-l border-l-secondary-100 bg-white min-[1155px]:block'>
            <div className='mx-auto flex min-h-full max-w-130 flex-col gap-8 px-6 py-8'>

                {/* Sidebar header section */}
                <header className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-secondary-500'>
                    <span className='flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-800'>
                        <HeaderIcon className='h-4 w-4' aria-hidden='true' />
                    </span>
                    {isPeopleSearchPage ? 'People to discover' : 'Your Voltex'}
                </header>

                {/* Main cards section */}
                {
                    isPeopleSearchPage ? (
                        <>
                            <section className='relative overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 p-6'>
                                <div className='absolute -right-8 -top-8 h-28 w-28 rounded-full border-18 border-sky-100/70' aria-hidden='true' />
                                <div className='relative'>
                                    <p className='text-xs font-bold uppercase tracking-widest text-sky-800'>A fresh perspective</p>
                                    <h2 className='mt-3 max-w-56 text-2xl font-bold leading-tight text-secondary-950'>Good conversations start with curiosity.</h2>
                                    <p className='mt-3 text-sm leading-6 text-secondary-700'>Make room for a voice and a point of view you haven’t heard before.</p>
                                </div>
                            </section>

                            <section className='rounded-xl border border-secondary-100 bg-secondary-50 p-5' aria-labelledby='discovery-note-heading'>
                                <div className='flex items-center justify-between gap-3'>
                                    <h2 id='discovery-note-heading' className='text-xs font-bold uppercase tracking-widest text-secondary-500'>Start with common ground</h2>
                                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sky-700'>
                                        <MessageCircle className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                </div>

                                <p className='mt-3 text-lg font-semibold leading-7 text-secondary-800'>A shared interest can be the start of a great conversation.</p>
                            </section>
                        </>
                    ) : (
                        <>
                            <section className='relative overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 p-6'>
                                <div className='absolute -right-8 -top-8 h-28 w-28 rounded-full border-18 border-sky-100/70' aria-hidden='true' />
                                <div className='relative'>
                                    <p className='text-xs font-bold uppercase tracking-widest text-sky-800'>Make it yours</p>
                                    <h2 className='mt-3 max-w-56 text-2xl font-bold leading-tight text-secondary-950'>Find your next favorite voice.</h2>
                                    <p className='mt-3 text-sm leading-6 text-secondary-700'>Good conversations begin with people you want to hear.</p>
                                    <button
                                        type='button'
                                        onClick={() => navigate(ROUTES.searchUser)}
                                        className='mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-secondary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-950 cursor-pointer'
                                    >
                                        <Search className='h-4 w-4' aria-hidden='true' />
                                        Explore people
                                        <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
                                    </button>
                                </div>
                            </section>

                            <section className='rounded-xl border border-secondary-100 bg-secondary-50 p-5'>
                                <div className='flex items-center justify-between gap-3'>
                                    <h2 className='text-xs font-bold uppercase tracking-widest text-secondary-500'>A thought to share</h2>
                                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sky-700'>
                                        <MessageCircle className='h-4 w-4' aria-hidden='true' />
                                    </span>
                                </div>
                                <blockquote className='mt-3 text-lg font-semibold leading-7 text-secondary-800'>
                                    What small thing never fails to brighten your day?
                                </blockquote>
                            </section>
                        </>
                    )
                }

                {/* Footer copyright section */}
                <footer className='mt-auto border-t border-secondary-100 pt-5'>
                    <p className='text-[11px] text-secondary-400'>© {new Date().getFullYear()} Voltex. All rights reserved.</p>
                </footer>
            </div>
        </aside>
    )
};

export default RightSideBar;