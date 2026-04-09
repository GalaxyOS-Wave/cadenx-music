
import { auth, db } from '../firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const ProfileApp = {
    state: {
        loading: false,
        enrollments: []
    },

    render(os) {
        if (!os.user) {
            return `
                <div class="flex flex-col items-center justify-center h-[60vh] space-y-8 text-center px-4">
                    <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent-soft flex items-center justify-center text-academy shadow-inner">
                        <i data-lucide="lock" class="w-8 h-8 md:w-10 md:h-10"></i>
                    </div>
                    <div class="space-y-4">
                        <h2 class="display text-3xl md:text-4xl font-black tracking-tighter uppercase text-[var(--text)]">Access <span class="text-academy">Denied</span></h2>
                        <p class="text-[var(--text-muted)] max-w-md mx-auto text-sm md:text-base">Please sign in to view your personalized dashboard and course progress.</p>
                    </div>
                    <button onclick="os.handleLogin()" class="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-academy text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs shadow-2xl hover:bg-academy/90 transition-all flex items-center justify-center space-x-4">
                        <i data-lucide="log-in" class="w-4 h-4"></i>
                        <span>Sign In with Google</span>
                    </button>
                </div>
            `;
        }

        const userData = os.userData || {};
        const purchasedBatches = userData.purchasedBatches || [];

        return `
            <div class="space-y-8 md:space-y-12 animate-fade-in pb-20">
                <!-- Profile Header -->
                <div class="bg-slate-900 dark:bg-slate-800/50 rounded-[32px] md:rounded-[64px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
                    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-academy/10 to-transparent"></div>
                    <div class="relative flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                        <div class="relative group">
                            <img src="${os.user.photoURL}" class="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[48px] border-8 border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500 object-cover" referrerPolicy="no-referrer">
                            <div class="absolute -bottom-4 -right-4 w-12 h-12 md:w-16 md:h-16 bg-academy rounded-2xl md:rounded-3xl flex items-center justify-center border-4 border-slate-900 dark:border-slate-800 shadow-xl">
                                <i data-lucide="award" class="w-6 h-6 md:w-8 md:h-8"></i>
                            </div>
                        </div>
                        <div class="space-y-4 md:space-y-6 text-center md:text-left flex-1">
                            <div class="space-y-1 md:space-y-2">
                                <p class="text-[10px] md:text-xs mono text-academy uppercase tracking-[0.4em] font-bold">Student Identity // Verified</p>
                                <h2 class="display text-4xl md:text-7xl font-black tracking-tighter leading-tight">${os.user.displayName}</h2>
                            </div>
                            <div class="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                                <div class="px-4 md:px-6 py-2 md:py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-3">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span class="text-[9px] md:text-[11px] font-bold uppercase tracking-widest">${purchasedBatches.length} Active Batches</span>
                                </div>
                                <div class="px-4 md:px-6 py-2 md:py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-3">
                                    <i data-lucide="shield-check" class="w-4 h-4 text-academy"></i>
                                    <span class="text-[9px] md:text-[11px] font-bold uppercase tracking-widest">${userData.role || 'Pro Member'}</span>
                                </div>
                                <button onclick="os.handleLogout()" class="px-4 md:px-6 py-2 md:py-3 bg-red-500/10 backdrop-blur-md rounded-full border border-red-500/20 flex items-center space-x-3 hover:bg-red-500/20 transition-all">
                                    <i data-lucide="log-out" class="w-4 h-4 text-red-400"></i>
                                    <span class="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-red-400">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Content -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <!-- My Batches -->
                    <div class="lg:col-span-8 space-y-8 md:space-y-12">
                        <div class="flex items-center justify-between px-2">
                            <h2 class="display text-2xl md:text-3xl font-black tracking-tighter text-[var(--text)]">My <span class="text-academy">Batches</span></h2>
                            <button onclick="os.openApp('academy')" class="text-[10px] font-black text-academy uppercase tracking-widest hover:underline">Explore More</button>
                        </div>

                        ${purchasedBatches.length > 0 ? `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                ${purchasedBatches.map(batchId => {
                                    const batch = this.getBatchInfo(batchId);
                                    return `
                                        <div onclick="os.openApp('academy'); os.appMethods.academy.handleBatchClick('${batchId}', os)" class="group bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-accent-soft hover:border-academy/30 transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 active:scale-95">
                                            <div class="flex items-start justify-between mb-8">
                                                <div class="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-accent-soft flex items-center justify-center text-academy group-hover:bg-academy group-hover:text-white transition-all duration-500">
                                                    <i data-lucide="play" class="w-6 h-6 md:w-8 md:h-8"></i>
                                                </div>
                                                <span class="px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Unlocked</span>
                                            </div>
                                            <div class="space-y-3">
                                                <h4 class="display text-xl md:text-2xl font-black text-[var(--text)] tracking-tight">${batch.name}</h4>
                                                <p class="text-[var(--text-muted)] text-xs md:text-sm font-light line-clamp-2 leading-relaxed">${batch.description}</p>
                                            </div>
                                            <div class="mt-8 pt-6 border-t border-accent-soft flex items-center justify-between">
                                                <div class="flex items-center space-x-2">
                                                    <i data-lucide="clock" class="w-4 h-4 text-[var(--text-muted)]"></i>
                                                    <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Lifetime Access</span>
                                                </div>
                                                <i data-lucide="arrow-right" class="w-5 h-5 text-academy opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : `
                            <div class="bg-accent-soft rounded-[40px] p-12 md:p-20 text-center space-y-6 border-2 border-dashed border-accent-soft">
                                <div class="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-[var(--text-muted)] mx-auto shadow-sm">
                                    <i data-lucide="book-open" class="w-10 h-10"></i>
                                </div>
                                <div class="space-y-2">
                                    <h3 class="display text-2xl font-black text-[var(--text)] uppercase tracking-tighter">No Batches Found</h3>
                                    <p class="text-[var(--text-muted)] text-sm max-w-xs mx-auto">You haven't enrolled in any batches yet. Start your journey today!</p>
                                </div>
                                <button onclick="os.openApp('academy')" class="px-8 py-4 bg-academy text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-academy/90 transition-all">
                                    Browse Curriculum
                                </button>
                            </div>
                        `}
                    </div>

                    <!-- Sidebar -->
                    <div class="lg:col-span-4 space-y-8 md:space-y-12">
                        <div class="bg-white dark:bg-slate-900 border border-accent-soft rounded-[32px] md:rounded-[48px] p-8 md:p-10 shadow-xl space-y-8">
                            <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Ecosystem Status</h4>
                            <div class="space-y-8">
                                ${this.renderProgressItem('Curriculum Progress', 65, 'bg-academy')}
                                ${this.renderProgressItem('Community Engagement', 42, 'bg-emerald-500')}
                                ${this.renderProgressItem('Project Submissions', 88, 'bg-purple-500')}
                            </div>
                        </div>

                        <div class="bg-academy rounded-[32px] md:rounded-[48px] p-8 md:p-10 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                            <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Next Milestone</h4>
                            <div class="space-y-4">
                                <p class="text-xl md:text-2xl font-black leading-tight">Complete Sound Design to unlock the Studio Pass.</p>
                                <button class="w-full py-4 bg-white dark:bg-slate-900 text-academy rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-accent-soft transition-all">View Roadmap</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderProgressItem(label, progress, colorClass) {
        return `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">${label}</p>
                    <p class="text-[10px] font-black text-[var(--text)]">${progress}%</p>
                </div>
                <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full ${colorClass} rounded-full" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    },

    getBatchInfo(batchId) {
        const batches = {
            'b1': { name: 'Music Production Masterclass', description: 'Master the core tools of modern music production from scratch.' },
            'b2': { name: 'Sound Design & Synthesis', description: 'Create unique sounds and textures using advanced synthesis techniques.' },
            'b3': { name: 'Mixing & Mastering Elite', description: 'Take your mixes to the next level with professional processing and mastering.' },
            'b4': { name: 'Music Business & Strategy', description: 'Learn how to navigate the music industry and build a sustainable career.' }
        };
        return batches[batchId] || { name: 'Unknown Course', description: 'Course details unavailable.' };
    }
};
