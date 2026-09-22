import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                screen: {
                    base: '#060d24',
                    panel: 'rgba(7, 15, 43, 0.85)',
                    primary: '#36d9ff',
                    text: '#e8f7ff',
                    muted: 'rgba(201, 230, 244, 0.62)',
                },
            },
            zIndex: {
                screen: '998',
                menu: '1099',
            },
            backgroundImage: {
                'screen-header': "url('/static/images/bg_header.png')",
                'screen-menu': "url('/static/images/menu_bg.png')",
                'screen-menu-active': "url('/static/images/menu_bg_active.png')",
            },
            boxShadow: {
                'screen-panel': 'inset 0 0 26px rgba(30,143,190,.08), 0 14px 50px rgba(0,5,12,.34)',
            },
        },
    },
    plugins: [],
} satisfies Config;
