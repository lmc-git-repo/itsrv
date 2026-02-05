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

            colors: {
                itsbg: '#101E33',      // main background
                itscard: '101E33', 
                itsblue: '#0d6efd',
                itsyellow: '#ffc107',
                itsgreen: '#198754',
                itsred: '#dc3545',
                itsmint: '#20c997',
            },

            boxShadow: {
                its: '0 12px 30px rgba(0,0,0,0.45)',
            },

            borderRadius: {
                its: '14px',
            },
        },
    },

    plugins: [forms],
};