
import { db, handleFirestoreError, OperationType } from '../firebase.js';

export const ACADEMY_DATA = [
    {
        id: 'b1',
        title: 'Sur Sadhana - Batch for beginners',
        description: 'The best basic production course for beginners. Master the fundamentals of music theory, DAW basics, and your first arrangement.',
        level: 'Beginner',
        duration: 'UPDATING soon',
        price: 'FREE',
        cover: 'data:image/jpeg;base64,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',
        thumbnail: 'data:image/jpeg;base64,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',
        purchaseUrl: 'https://forms.google.com/purchase-batch-1',
        videos: [
            { 
                id: 'v1', 
                title: 'Welcome to the batch!', 
                duration: '00:00', 
                thumbnail: '/graphics/sursadhana.png', 
                url: '/graphics/lecture1.mp4',
                quizUrl: 'https://forms.google.com/your-quiz-link-1',
                notes: '/notes/advanced_eq.txt',

            },
       
        ]
    },
];

export const AcademyApp = {
    state: {
        selectedBatch: null,
        activeVideo: null,
        quizState: { active: false, index: 0, score: 0, finished: false },
        showPurchaseScreen: null,
        showEnrollmentForm: null
    },

    render(os) {
        if (!os.user) {
            return `
                <div class="max-w-2xl mx-auto text-center space-y-8 py-24 px-6">
                    <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
                        <i data-lucide="lock" class="w-10 h-10"></i>
                    </div>
                    <div class="space-y-4">
                        <h2 class="text-3xl font-bold text-slate-900">Access Restricted</h2>
                        <p class="text-slate-600 text-lg">Please sign in with your Google account to access the Academy curriculum and track your learning progress.</p>
                    </div>
                    <button onclick="os.handleLogin()" class="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Sign In with Google</button>
                </div>
            `;
        }

        if (this.state.showEnrollmentForm) {
            return this.renderEnrollmentForm(this.state.showEnrollmentForm, os);
        }
        if (this.state.showPurchaseScreen) {
            return this.renderPurchaseScreen(this.state.showPurchaseScreen, os);
        }
        if (!this.state.selectedBatch) {
            return this.renderBatchList(os);
        }
        if (this.state.quizState.active) {
            return this.renderQuiz(os);
        }
        return this.renderCourseView(os);
    },

    renderEnrollmentForm(batch, os) {
        return `
            <div class="max-w-3xl mx-auto space-y-8 py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button onclick="window.os.appMethods.academy.closeEnrollmentForm()" class="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    <span class="text-sm font-medium">Back to Details</span>
                </button>

                <div class="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100">
                    <div class="mb-10">
                        <h2 class="text-3xl font-bold text-slate-900 mb-2">Enroll in <span class="text-blue-600">${batch.title}</span></h2>
                        <p class="text-slate-500">Fill in your details to start your learning journey.</p>
                    </div>

                    <form onsubmit="event.preventDefault(); window.os.appMethods.academy.submitEnrollment('${batch.id}')" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                                <input id="enroll-name" type="text" required value="${os.user.displayName}" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                                <input id="enroll-email" type="email" required value="${os.user.email}" readonly class="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 text-slate-500 cursor-not-allowed outline-none">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                                <input id="enroll-phone" type="tel" required class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="+91 00000 00000">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience Level</label>
                                <select id="enroll-experience" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Professional</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Why do you want to join?</label>
                            <textarea id="enroll-message" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px]" placeholder="Tell us about your learning goals..."></textarea>
                        </div>

                        <div class="pt-4">
                            <button type="submit" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]">
                                Complete Enrollment • ${batch.price}
                            </button>
                            <p class="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-medium">Secure checkout powered by Academy OS</p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    renderBatchList(os) {
        const purchasedBatches = os.userData?.purchasedBatches || [];
        return `
            <div class="max-w-7xl mx-auto px-4 py-12 space-y-12">
                <div class="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
                    <div class="text-center md:text-left space-y-4">
                        <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Explore <span class="text-blue-600">Batches</span></h1>
                        <p class="text-slate-500 text-lg max-w-xl">Join thousands of students learning from the best in the industry. Start your journey today.</p>
                    </div>
                    <div class="flex items-center space-x-6 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                        <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                            <i data-lucide="graduation-cap" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Courses</p>
                            <p class="text-2xl font-black text-slate-900">${ACADEMY_DATA.length} Batches</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${ACADEMY_DATA.map((batch, idx) => {
                        const isPurchased = purchasedBatches.includes(batch.id);
                        return `
                        <div onclick="window.os.appMethods.academy.handleBatchClick('${batch.id}')" 
                             class="group bg-white border border-slate-200 rounded-[32px] overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                             style="animation-delay: ${idx * 100}ms">
                            <div class="aspect-video relative overflow-hidden">
                                <img src="${batch.thumbnail || `https://picsum.photos/seed/${batch.id}/600/400`}" 
                                     onerror="this.onerror=null; this.src='https://picsum.photos/seed/${batch.id}/600/400'"
                                     alt="${batch.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <div class="absolute top-4 left-4">
                                    <span class="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100">${batch.level}</span>
                                </div>
                                ${!isPurchased ? `
                                <div class="absolute bottom-4 right-4">
                                    <span class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">${batch.price}</span>
                                </div>
                                ` : `
                                <div class="absolute inset-0 flex items-center justify-center bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div class="px-6 py-3 bg-white text-blue-600 rounded-2xl flex items-center space-x-3 shadow-2xl transform scale-90 group-hover:scale-100 transition-all font-bold">
                                        <i data-lucide="play" class="w-5 h-5 fill-current"></i>
                                        <span>Continue Learning</span>
                                    </div>
                                </div>
                                `}
                            </div>
                            <div class="p-8 space-y-4">
                                <div class="space-y-2">
                                    <h3 class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">${batch.title}</h3>
                                    <p class="text-slate-500 text-sm line-clamp-2 leading-relaxed">${batch.description}</p>
                                </div>
                                <div class="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div class="flex items-center space-x-2 text-slate-400">
                                        <i data-lucide="clock" class="w-4 h-4"></i>
                                        <span class="text-xs font-bold uppercase tracking-wider">${batch.duration}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-[10px] font-bold uppercase tracking-widest ${isPurchased ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'} px-3 py-1 rounded-full">
                                            ${isPurchased ? 'Enrolled' : 'Available'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    },

    renderPurchaseScreen(batch, os) {
        return `
            <div class="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <button onclick="window.os.appMethods.academy.closePurchaseScreen()" class="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    <span class="text-sm font-medium">Back to Batches</span>
                </button>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="space-y-10">
                        <div class="space-y-6">
                            <span class="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">${batch.level} Course</span>
                            <h2 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">Master <br><span class="text-blue-600">${batch.title}</span></h2>
                            <p class="text-slate-500 text-xl leading-relaxed">Everything you need to go from zero to hero. Get lifetime access to high-quality videos, quizzes, and exclusive resources.</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-4">
                                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <i data-lucide="infinity" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900">Lifetime Access</p>
                                    <p class="text-xs text-slate-500">Learn at your own pace</p>
                                </div>
                            </div>
                            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-4">
                                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <i data-lucide="file-check" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900">Quizzes & Tasks</p>
                                    <p class="text-xs text-slate-500">Validate your knowledge</p>
                                </div>
                            </div>
                        </div>

                        <div class="pt-6">
                            <button onclick="window.os.appMethods.academy.openEnrollmentForm()" class="w-full md:w-auto px-12 py-6 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:scale-105 active:scale-95">
                                Enroll Now for ${batch.price}
                            </button>
                        </div>
                    </div>

                    <div class="relative">
                        <div class="aspect-square bg-white rounded-[60px] overflow-hidden shadow-2xl border border-slate-100 p-4">
                            <img src="${batch.thumbnail || `https://picsum.photos/seed/${batch.id}/800/800`}" 
                                 onerror="this.onerror=null; this.src='https://picsum.photos/seed/${batch.id}/800/800'"
                                 class="w-full h-full object-cover rounded-[48px]">
                        </div>
                        <div class="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 space-y-2 hidden md:block">
                            <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">Course Stats</p>
                            <p class="text-2xl font-black text-slate-900">${batch.videos.length} Modules • ${batch.duration}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderCourseView() {
        const currentIdx = this.state.selectedBatch.videos.indexOf(this.state.activeVideo);
        const progress = Math.round(((currentIdx + 1) / this.state.selectedBatch.videos.length) * 100);

        return `
            <div class="max-w-7xl mx-auto px-4 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <!-- Main Content -->
                    <div class="lg:col-span-8 space-y-10">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Batch Progress</span>
                                <span class="text-blue-600">${progress}% Complete</span>
                            </div>
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-blue-600 transition-all duration-1000 ease-out" style="width: ${progress}%"></div>
                            </div>
                        </div>

                        <div class="aspect-video bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-slate-200 relative group">
                            ${this.state.activeVideo.url.includes('youtube.com') || this.state.activeVideo.url.includes('youtu.be') ? `
                                <iframe 
                                    src="${this.state.activeVideo.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}" 
                                    class="w-full h-full" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            ` : `
                                <video id="academy-video-player" 
                                       src="${this.state.activeVideo.url}" 
                                       poster="${this.state.activeVideo.thumbnail}"
                                       class="w-full h-full object-cover" 
                                       controls 
                                       autoplay
                                       playsinline
                                       webkit-playsinline
                                       onerror="this.parentElement.innerHTML = '<div class=\'flex flex-col items-center justify-center h-full text-white p-8 text-center\'><i data-lucide=\'alert-circle\' class=\'w-12 h-12 mb-4 text-red-500\'></i><p class=\'text-lg font-bold\'>Video Unavailable</p><p class=\'text-sm text-slate-400\'>Please ensure the video file is uploaded to /public/graphics/ and the path is correct.</p></div>'; lucide.createIcons();"
                                ></video>
                            `}
                        </div>
                        
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div class="space-y-3">
                                <h2 class="text-4xl font-black text-slate-900 tracking-tight">${this.state.activeVideo.title}</h2>
                                <div class="flex items-center space-x-4">
                                    <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-blue-100">Module ${currentIdx + 1}</span>
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${this.state.activeVideo.duration}</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 w-full md:w-auto">
                                <button onclick="window.os.appMethods.academy.downloadNotes()" class="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                                    <i data-lucide="download" class="w-4 h-4"></i>
                                    <span>Resources</span>
                                </button>
                                <button onclick="window.os.appMethods.academy.startQuiz()" class="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                    <i data-lucide="help-circle" class="w-4 h-4"></i>
                                    <span>Take Quiz</span>
                                </button>
                            </div>
                        </div>

                        <div class="bg-white border border-slate-200 rounded-[40px] p-10 md:p-14 shadow-sm">
                            <div class="flex items-center space-x-4 mb-8">
                                <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <i data-lucide="file-text" class="w-6 h-6"></i>
                                </div>
                                <h4 class="text-2xl font-bold text-slate-900">Module Overview</h4>
                            </div>
                            <div class="text-slate-900 leading-relaxed text-lg whitespace-pre-wrap font-medium">${this.state.activeVideo.fetchedNotes || 'Loading module overview...'}</div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="lg:col-span-4 space-y-8">
                        <div class="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                            <h4 class="text-xl font-bold text-slate-900 mb-8 px-2">Course Curriculum</h4>
                            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                ${this.state.selectedBatch.videos.map((v, idx) => `
                                    <div onclick="window.os.appMethods.academy.playVideo('${v.id}')" 
                                         class="flex items-center space-x-4 p-3 rounded-2xl border transition-all cursor-pointer group ${v.id === this.state.activeVideo.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'}">
                                        <div class="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                            <img src="${v.thumbnail}" 
                                                 onerror="this.onerror=null; this.src='https://picsum.photos/seed/${v.id}/100/60'"
                                                 class="w-full h-full object-cover">
                                            <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <i data-lucide="play" class="w-3 h-3 text-white fill-current"></i>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-bold truncate ${v.id === this.state.activeVideo.id ? 'text-white' : 'text-slate-700 group-hover:text-blue-600'}">${v.title}</p>
                                            <p class="text-[10px] font-bold uppercase tracking-widest mt-1 ${v.id === this.state.activeVideo.id ? 'text-blue-100' : 'text-slate-400'}">${v.duration}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="bg-blue-600 rounded-[40px] p-10 text-white space-y-6 shadow-xl shadow-blue-100">
                            <div class="flex items-center space-x-4">
                                <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md overflow-hidden border border-white/20">
                                    <img src="https://picsum.photos/seed/instructor/200/200" alt="Instructor" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <p class="text-lg font-bold">Alex Rivers</p>
                                    <p class="text-xs font-bold uppercase tracking-widest text-blue-100">Master Instructor</p>
                                </div>
                            </div>
                            <p class="text-sm text-blue-50 leading-relaxed">"Music production is a journey of discovery. I'm here to guide you through every beat and melody."</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderQuiz() {
        if (!this.state.activeVideo || !this.state.activeVideo.quiz) {
            return `
                <div class="max-w-2xl mx-auto text-center py-24 space-y-6">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <i data-lucide="help-circle" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900">No Quiz Available</h2>
                    <p class="text-slate-500 text-lg">This module does not have an interactive quiz yet. Please check back later.</p>
                    <button onclick="window.os.appMethods.academy.closeQuiz()" class="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Back to Course</button>
                </div>
            `;
        }

        if (this.state.quizState.finished) {
            const percentage = Math.round((this.state.quizState.score / this.state.activeVideo.quiz.length) * 100);
            return `
                <div class="max-w-3xl mx-auto py-20 px-6 text-center space-y-12 animate-in zoom-in-95 duration-500">
                    <div class="relative inline-block">
                        <div class="w-40 h-40 bg-blue-50 rounded-[48px] flex items-center justify-center mx-auto text-blue-600 shadow-xl border border-blue-100">
                            <i data-lucide="award" class="w-20 h-20"></i>
                        </div>
                        <div class="absolute -top-4 -right-4 bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                            ${percentage}%
                        </div>
                    </div>
                    <div class="space-y-4">
                        <h2 class="text-5xl font-black text-slate-900 tracking-tight">Quiz Completed!</h2>
                        <p class="text-slate-500 text-xl">You scored <span class="text-blue-600 font-bold">${this.state.quizState.score}</span> out of <span class="font-bold">${this.state.activeVideo.quiz.length}</span>.</p>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                        <button onclick="window.os.appMethods.academy.closeQuiz()" class="px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Back to Course</button>
                        <button onclick="window.os.appMethods.academy.resetQuiz()" class="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">Try Again</button>
                    </div>
                </div>
            `;
        }

        const question = this.state.activeVideo.quiz[this.state.quizState.index];
        const progress = ((this.state.quizState.index + 1) / this.state.activeVideo.quiz.length) * 100;

        return `
            <div class="max-w-4xl mx-auto py-12 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div class="flex justify-between items-center border-b border-slate-100 pb-8">
                    <div class="space-y-2">
                        <p class="text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Question ${this.state.quizState.index + 1} of ${this.state.activeVideo.quiz.length}</p>
                        <div class="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-600 transition-all duration-500" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <button onclick="window.os.appMethods.academy.closeQuiz()" class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>

                <div class="space-y-12">
                    <h3 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">${question.q}</h3>
                    <div class="grid grid-cols-1 gap-4">
                        ${question.o.map((opt, idx) => `
                            <button onclick="window.os.appMethods.academy.answerQuiz(${idx})" 
                                    class="group w-full p-8 bg-white border border-slate-200 rounded-3xl text-left hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
                                <div class="flex items-center space-x-6">
                                    <div class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 font-bold flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        ${String.fromCharCode(65 + idx)}
                                    </div>
                                    <span class="text-xl font-bold text-slate-700 group-hover:text-slate-900">${opt}</span>
                                </div>
                                <i data-lucide="chevron-right" class="w-6 h-6 text-slate-200 group-hover:text-blue-600 transition-all"></i>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Methods
    handleBatchClick(batchId, os = window.os) {
        const batch = ACADEMY_DATA.find(b => b.id === batchId);
        const purchasedBatches = os.userData?.purchasedBatches || [];
        
        if (purchasedBatches.includes(batchId)) {
            this.selectBatch(batchId, os);
        } else {
            this.state.showPurchaseScreen = batch;
            os.refreshApp();
        }
    },

    selectBatch(batchId, os = window.os) {
        this.state.selectedBatch = ACADEMY_DATA.find(b => b.id === batchId);
        this.state.showPurchaseScreen = null;
        this.playVideo(this.state.selectedBatch.videos[0].id, os);
    },

    closePurchaseScreen(os = window.os) {
        this.state.showPurchaseScreen = null;
        os.refreshApp();
    },

    openEnrollmentForm(os = window.os) {
        this.state.showEnrollmentForm = this.state.showPurchaseScreen;
        this.state.showPurchaseScreen = null;
        os.refreshApp();
    },

    closeEnrollmentForm(os = window.os) {
        this.state.showPurchaseScreen = this.state.showEnrollmentForm;
        this.state.showEnrollmentForm = null;
        os.refreshApp();
    },

    async submitEnrollment(batchId, os = window.os) {
        try {
            const { doc, updateDoc, addDoc, collection, arrayUnion, serverTimestamp } = await import('firebase/firestore');
            
            const enrollmentData = {
                uid: os.user.uid,
                name: document.getElementById('enroll-name').value,
                email: document.getElementById('enroll-email').value,
                phone: document.getElementById('enroll-phone').value,
                experience: document.getElementById('enroll-experience').value,
                message: document.getElementById('enroll-message').value,
                course: batchId,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            try {
                await addDoc(collection(db, 'enrollments'), enrollmentData);
            } catch (error) {
                handleFirestoreError(error, OperationType.CREATE, 'enrollments');
            }

            try {
                const userRef = doc(db, 'users', os.user.uid);
                await updateDoc(userRef, {
                    purchasedBatches: arrayUnion(batchId)
                });
            } catch (error) {
                handleFirestoreError(error, OperationType.UPDATE, `users/${os.user.uid}`);
            }

            try {
                const batch = ACADEMY_DATA.find(b => b.id === batchId);
                await fetch('/api/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enrollmentData, batchName: batch ? batch.title : batchId })
                });
            } catch (e) {}
            
            os.showNotification('Enrollment successful!', 'success');
            this.state.showEnrollmentForm = null;
            this.state.showPurchaseScreen = null;
            this.selectBatch(batchId, os);
        } catch (error) {
            console.error('Enrollment Error:', error);
            os.showNotification('Enrollment failed. Please try again.', 'error');
        }
    },

    async playVideo(videoId, os = window.os) {
        const video = this.state.selectedBatch.videos.find(v => v.id === videoId);
        if (!video) return;

        this.state.activeVideo = { ...video, fetchedNotes: 'Loading module overview...' };
        this.state.quizState = { active: false, index: 0, score: 0, finished: false };
        os.refreshApp();
        
        // Scroll to video player
        const player = document.getElementById('academy-video-player');
        if (player) player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        if (video.notes && (video.notes.startsWith('http') || video.notes.startsWith('/') || video.notes.endsWith('.txt'))) {
            try {
                const response = await fetch(video.notes);
                if (response.ok) {
                    this.state.activeVideo.fetchedNotes = await response.text();
                } else {
                    this.state.activeVideo.fetchedNotes = "Module overview content is currently being updated.";
                }
            } catch (e) {
                this.state.activeVideo.fetchedNotes = "Module overview content is currently being updated.";
            }
        } else {
            this.state.activeVideo.fetchedNotes = video.notes || "No overview available for this module.";
        }
        os.refreshApp();
    },

    startQuiz(os = window.os) {
        if (!this.state.activeVideo.quiz) {
            window.open(this.state.activeVideo.quizUrl, '_blank');
            return;
        }
        this.state.quizState = { active: true, index: 0, score: 0, finished: false };
        os.refreshApp();
    },

    closeQuiz(os = window.os) {
        this.state.quizState.active = false;
        os.refreshApp();
    },

    answerQuiz(idx, os = window.os) {
        const question = this.state.activeVideo.quiz[this.state.quizState.index];
        if (idx === question.a) {
            this.state.quizState.score++;
        }

        if (this.state.quizState.index < this.state.activeVideo.quiz.length - 1) {
            this.state.quizState.index++;
        } else {
            this.state.quizState.finished = true;
        }
        os.refreshApp();
    },

    resetQuiz(os = window.os) {
        this.state.quizState = { active: true, index: 0, score: 0, finished: false };
        os.refreshApp();
    },

    downloadNotes() {
        const notes = this.state.activeVideo.fetchedNotes || this.state.activeVideo.notes;
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.state.activeVideo.title}_Notes.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};
