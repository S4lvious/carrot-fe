import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#FFF5E6',
            100: '#FFE8CC',
            200: '#FFD8A8',
            300: '#FFC078',
            400: '#FFA94D',
            500: '#FF9100',
            600: '#DB7B00',
            700: '#B86B00',
            800: '#955700',
            900: '#734500',
            950: '#5A3500'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#FF9100',  // Arancione vivo
                    inverseColor: '#ffffff',
                    hoverColor: '#FFA94D',
                    activeColor: '#FFC078'
                },
                highlight: {
                    background: '#FF9100',
                    focusBackground: '#FFA94D',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '#FFF5E6',
                    inverseColor: '#5A3500',
                    hoverColor: '#FFE8CC',
                    activeColor: '#FFD8A8'
                },
                highlight: {
                    background: 'rgba(255, 145, 0, .16)',
                    focusBackground: 'rgba(255, 145, 0, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

export default MyPreset;
