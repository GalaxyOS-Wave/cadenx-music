
import { db, handleFirestoreError, OperationType } from '../firebase.js';

export const ACADEMY_DATA = [
    {
        id: 'b1',
        title: 'Sur Sadhana - Batch for beginners',
        description: 'The best basic production course for beginners. Master the fundamentals of music theory, DAW basics, and your first arrangement.',
        level: 'Beginner',
        duration: '12 Hours',
        price: '₹0',
        cover: 'graphics/sursadhana.png',
        thumbnail: 'graphics/sursadhana.png',
        purchaseUrl: 'https://forms.google.com/purchase-batch-1',
        videos: [
            { 
                id: 'v1', 
                title: 'Welcome to the batch!', 
                duration: '15:00', 
                thumbnail: '/graphics/sursadhana.png', 
                url: '/graphics/sursadhana.png',
                quizUrl: 'https://forms.google.com/your-quiz-link-1',
                notes: '/notes/welcome1.txt',
                quiz: [
                    { q: "What is the primary focus of this batch?", o: ["Advanced Mixing", "Beginner Fundamentals", "Live Performance", "Marketing"], a: 1 },
                    { q: "Which DAW is recommended for beginners?", o: ["Any DAW", "Only Ableton", "Only FL Studio", "Only Logic"], a: 0 }
                ]
            },
            { 
                id: 'v2', 
                title: 'Introduction to Sound', 
                duration: '45:00', 
                thumbnail: '/graphics/sursadhana.png', 
                url: '/graphics/sursadhana.png',
                quizUrl: 'https://forms.google.com/your-quiz-link-2',
                notes: 'In this module, we explore the physics of sound and how it translates to digital audio.'
            }
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
                                <img src="${batch.thumbnail || `https://picsum.photos/seed/${batch.id}/600/400`}" alt="${batch.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
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
                                    <div class="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                                        <i data-lucide="play" class="w-8 h-8 fill-current"></i>
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
                            <img src="${batch.thumbnail || `https://picsum.photos/seed/${batch.id}/800/800`}" class="w-full h-full object-cover rounded-[48px]">
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

                        <div class="aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border border-slate-200">
                            <video src="${this.state.activeVideo.url}" class="w-full h-full" controls autoplay></video>
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
                                         class="flex items-center space-x-4 p-4 rounded-2xl border transition-all cursor-pointer group ${v.id === this.state.activeVideo.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'}">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${v.id === this.state.activeVideo.id ? 'bg-white text-blue-600' : 'bg-white text-slate-400 border border-slate-100'}">
                                            ${idx + 1}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-bold truncate ${v.id === this.state.activeVideo.id ? 'text-white' : 'text-slate-700 group-hover:text-blue-600'}">${v.title}</p>
                                            <p class="text-[10px] font-bold uppercase tracking-widest mt-1 ${v.id === this.state.activeVideo.id ? 'text-blue-100' : 'text-slate-400'}">${v.duration}</p>
                                        </div>
                                        ${v.id === this.state.activeVideo.id ? '<div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>' : ''}
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
        this.state.activeVideo = video;
        this.state.quizState = { active: false, index: 0, score: 0, finished: false };
        
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
            this.state.activeVideo.fetchedNotes = video.notes;
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
