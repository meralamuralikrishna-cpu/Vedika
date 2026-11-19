import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PROFILE } from '@/data/starterLayouts';
import { supabase } from '@/lib/supabase';
import { createBookingRequest, getBookingRequests, removeBookingRequest, updateBookingRequestStatus } from '@/lib/bookingRequests';
const AppContext = createContext(null);
const DEFAULT_WORKSPACE = { name: '', eventName: '', eventDate: '', venue: '' };
export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [offlineDemo, setOfflineDemo] = useState(false);
    const [authReady, setAuthReady] = useState(!supabase);
    const [cloudReady, setCloudReady] = useState(false);
    const [cloudError, setCloudError] = useState('');
    const [cloudSaveStatus, setCloudSaveStatus] = useState('saved');
    const [loadAttempt, setLoadAttempt] = useState(0);
    const retryCloudLoad = useCallback(() => setLoadAttempt((attempt) => attempt + 1), []);
    useEffect(() => {
        if (!supabase) return;
        let alive = true;
        supabase.auth.getSession().then(({ data }) => { if (alive) { setUser(data.session?.user ?? null); setAuthReady(true); } });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) {
                setCloudReady(false);
                setDesigns([]);
                setMoodboards([]);
                setBudgets([]);
                setBookings([]);
                setNotifications([]);
                setTemplateFavorites([]);
                setDecoratorFavorites([]);
                setLocaleState('en');
                setActiveDesignIdState(null);
                setProfileState(DEFAULT_PROFILE);
                setWorkspace(DEFAULT_WORKSPACE);
            }
        });
        return () => { alive = false; listener.subscription.unsubscribe(); };
    }, []);
    const [locale, setLocaleState] = useState('en');
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);
    const [sidebarCollapsed, setSidebarCollapsedState] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [designs, setDesigns] = useState([]);
    const [moodboards, setMoodboards] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfileState] = useState(DEFAULT_PROFILE);
    const [workspace, setWorkspace] = useState(DEFAULT_WORKSPACE);
    const [templateFavorites, setTemplateFavorites] = useState([]);
    const [decoratorFavorites, setDecoratorFavorites] = useState([]);
    const [activeDesignId, setActiveDesignIdState] = useState(null);
    useEffect(() => {
        if (!supabase || !user) { setCloudReady(false); return; }
        let alive = true;
        setCloudReady(false);
        setCloudError('');
        (async () => {
            const { data, error } = await supabase.from('user_data').select('payload').eq('user_id', user.id).maybeSingle();
            if (!alive) return;
            if (error) {
                console.error('Could not load account data', error);
                setCloudError('Could not load your saved workspace. Your existing data has been left untouched.');
                setCloudReady(true);
                return;
            }
            const bookingRows = await getBookingRequests().catch((bookingError) => {
                console.error('Could not load booking requests', bookingError);
                return [];
            });
            if (!alive) return;
            setBookings(bookingRows);
            const p = data?.payload;
            if (p) {
                setDesigns((p.designs ?? []).filter((item) => !item.isDemo && !item.id?.startsWith('design-seed-')));
                setMoodboards((p.moodboards ?? []).filter((item) => !item.isDemo));
                setBudgets(Array.isArray(p.budgets) ? p.budgets : []);
                setProfileState({ ...DEFAULT_PROFILE, ...p.profile, email: user.email ?? p.profile?.email ?? DEFAULT_PROFILE.email });
                setWorkspace({ ...DEFAULT_WORKSPACE, ...p.workspace });
                setTemplateFavorites(p.templateFavorites ?? []);
                setDecoratorFavorites(p.decoratorFavorites ?? []);
                setLocaleState(p.locale ?? 'en');
                setNotifications((p.notifications ?? []).filter((item) => !['n1', 'n2', 'n3'].includes(item.id)));
                setActiveDesignIdState(p.activeDesignId ?? null);
            } else {
                setDesigns([]);
                setMoodboards([]);
                setBudgets([]);
                setNotifications([]);
                setTemplateFavorites([]);
                setDecoratorFavorites([]);
                setActiveDesignIdState(null);
                setProfileState({ ...DEFAULT_PROFILE, name: user.user_metadata?.name || DEFAULT_PROFILE.name, email: user.email ?? DEFAULT_PROFILE.email });
                setWorkspace(DEFAULT_WORKSPACE);
            }
            setCloudReady(true);
        })();
        return () => { alive = false; };
    }, [user?.id, loadAttempt]);
    useEffect(() => {
        if (!supabase || !user || !cloudReady || cloudError) return;
        const payload = { designs, moodboards, budgets, profile, workspace, templateFavorites, decoratorFavorites, locale, notifications, activeDesignId };
        setCloudSaveStatus('saving');
        const timer = setTimeout(async () => {
            const { error } = await supabase.from('user_data').upsert({ user_id: user.id, payload, updated_at: new Date().toISOString() });
            if (error) {
                console.error('Could not save account data', error);
                setCloudSaveStatus('error');
            } else setCloudSaveStatus('saved');
        }, 500);
        return () => clearTimeout(timer);
    }, [user?.id, cloudReady, cloudError, designs, moodboards, budgets, profile, workspace, templateFavorites, decoratorFavorites, locale, notifications, activeDesignId]);
    const signIn = useCallback(async (email, password) => {
        if (!supabase) return { error: 'Account sign-in is unavailable. Configure the Supabase URL and publishable key, then restart the app.' };
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { session: data.session, error: error?.message };
    }, []);
    const signUp = useCallback(async (email, password, name) => {
        if (!supabase) return { error: 'Account creation is unavailable. Configure the Supabase URL and publishable key, then restart the app.' };
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
                emailRedirectTo: `${window.location.origin}/`,
            },
        });
        return { session: data.session, error: error?.message };
    }, []);
    const resendConfirmation = useCallback(async (email) => {
        if (!supabase) return { error: 'Account access is unavailable because Supabase is not configured.' };
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        return { error: error?.message };
    }, []);
    const signOut = useCallback(async () => { if (supabase) await supabase.auth.signOut(); }, []);
    const enterOfflineDemo = useCallback(() => setOfflineDemo(true), []);
    const leaveOfflineDemo = useCallback(() => setOfflineDemo(false), []);
    const setLocale = useCallback((l) => {
        setLocaleState(l);
        setProfileState((p) => ({ ...p, preferredLanguage: l }));
    }, []);
    const setSidebarCollapsed = useCallback((v) => setSidebarCollapsedState(v), []);
    const saveDesign = useCallback((d) => {
        setDesigns((prev) => {
            const idx = prev.findIndex((x) => x.id === d.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = d;
                return next;
            }
            return [d, ...prev];
        });
    }, []);
    const deleteDesign = useCallback((id) => {
        setDesigns((prev) => prev.filter((d) => d.id !== id));
    }, []);
    const toggleDesignFavorite = useCallback((id) => {
        setDesigns((prev) => prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)));
    }, []);
    const saveMoodboard = useCallback((m) => {
        setMoodboards((prev) => {
            const idx = prev.findIndex((x) => x.id === m.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = m;
                return next;
            }
            return [m, ...prev];
        });
    }, []);
    const deleteMoodboard = useCallback((id) => {
        setMoodboards((prev) => prev.filter((m) => m.id !== id));
    }, []);
    const toggleMoodboardFavorite = useCallback((id) => {
        setMoodboards((prev) => prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)));
    }, []);
    const saveBudget = useCallback((budget) => {
        setBudgets((prev) => {
            const idx = prev.findIndex((item) => item.id === budget.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = budget;
                return next;
            }
            return [budget, ...prev];
        });
    }, []);
    const deleteBudget = useCallback((id) => {
        setBudgets((prev) => prev.filter((item) => item.id !== id));
    }, []);
    const saveBooking = useCallback(async (booking) => {
        const saved = await createBookingRequest(booking);
        setBookings((prev) => [saved, ...prev]);
        return saved;
    }, []);
    const setBookingStatus = useCallback(async (id, status, statusNote = '') => {
        const updated = await updateBookingRequestStatus(id, status, statusNote);
        setBookings((prev) => prev.map((booking) => booking.id === id ? updated : booking));
        return updated;
    }, []);
    const deleteBooking = useCallback(async (id) => {
        await removeBookingRequest(id);
        setBookings((prev) => prev.filter((b) => b.id !== id));
    }, []);
    const markNotificationRead = useCallback((id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }, []);
    const markAllNotificationsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);
    const setProfile = useCallback((p) => setProfileState(p), []);
    const updateWorkspace = useCallback((patch) => setWorkspace((current) => ({ ...current, ...patch })), []);
    const toggleTemplateFavorite = useCallback((id) => {
        setTemplateFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }, []);
    const toggleDecoratorFavorite = useCallback((id) => {
        setDecoratorFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }, []);
    const setActiveDesignId = useCallback((id) => setActiveDesignIdState(id), []);
    const value = useMemo(() => ({
        locale,
        setLocale,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        setMobileNavOpen,
        designs,
        saveDesign,
        deleteDesign,
        toggleDesignFavorite,
        moodboards,
        saveMoodboard,
        deleteMoodboard,
        toggleMoodboardFavorite,
        budgets,
        saveBudget,
        deleteBudget,
        bookings,
        saveBooking,
        setBookingStatus,
        deleteBooking,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        profile,
        setProfile,
        workspace,
        updateWorkspace,
        templateFavorites,
        toggleTemplateFavorite,
        decoratorFavorites,
        toggleDecoratorFavorite,
        activeDesignId,
        setActiveDesignId,
        user,
        isAdmin: user?.app_metadata?.role === 'admin',
        authReady,
        cloudReady,
        cloudError,
        cloudSaveStatus,
        retryCloudLoad,
        authEnabled: !!supabase,
        canSaveData: !!supabase && !!user && !offlineDemo,
        offlineDemo,
        enterOfflineDemo,
        leaveOfflineDemo,
        signIn,
        signUp,
        resendConfirmation,
        signOut,
    }), [
        locale,
        setLocale,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        designs,
        saveDesign,
        deleteDesign,
        toggleDesignFavorite,
        moodboards,
        saveMoodboard,
        deleteMoodboard,
        toggleMoodboardFavorite,
        budgets,
        saveBudget,
        deleteBudget,
        bookings,
        saveBooking,
        setBookingStatus,
        deleteBooking,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        profile,
        setProfile,
        workspace,
        updateWorkspace,
        templateFavorites,
        toggleTemplateFavorite,
        decoratorFavorites,
        toggleDecoratorFavorite,
        activeDesignId,
        setActiveDesignId,
        user,
        authReady,
        cloudReady,
        cloudError,
        cloudSaveStatus,
        retryCloudLoad,
        offlineDemo,
        enterOfflineDemo,
        leaveOfflineDemo,
        signIn,
        signUp,
        resendConfirmation,
        signOut,
    ]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx)
        throw new Error('useApp must be used within AppProvider');
    return ctx;
}
