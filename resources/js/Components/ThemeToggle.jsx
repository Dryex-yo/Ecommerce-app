import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 bg-gray-100/50 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10"
        >
            <div className="relative w-5 h-5">
                {/* Ikon Matahari */}
                <span className={`absolute inset-0 transform transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                    ☀️
                </span>
                {/* Ikon Bulan */}
                <span className={`absolute inset-0 transform transition-all duration-500 ${!isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                    🌙
                </span>
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
        </button>
    );
}