import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'infinite-scroll-reverse': 'infinite-scroll-reverse 35s linear infinite',
                'infinite-scroll': 'infinite-scroll 40s linear infinite', // Animasi baru ke kiri
            },
            keyframes: {
                'infinite-scroll-reverse': {
                    from: { transform: 'translateX(-50%)' },
                    to: { transform: 'translateX(0)' },
                },
                'infinite-scroll': { // Keyframe baru ke kiri
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                }
            }
        },
    },

    plugins: [forms],
};


