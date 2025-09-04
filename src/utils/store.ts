import { create } from 'zustand';
import type { LocaleKey } from '../i18n';

type HoveredCountry = { iso_a3: string; name: string } | null;

type AppState = {
	rotationSpeed: number; // radians per second baseline
	zoomSensitivity: number;
	reducedMotion: boolean;
	hoveredCountry: HoveredCountry;
	locale: LocaleKey;
	showSettings: boolean;
	setRotationSpeed: (v: number) => void;
	setZoomSensitivity: (v: number) => void;
	setReducedMotion: (v: boolean) => void;
	setHoveredCountry: (c: HoveredCountry) => void;
	setLocale: (l: LocaleKey) => void;
	setShowSettings: (v: boolean) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
	rotationSpeed: 0.2,
	zoomSensitivity: 0.5,
	reducedMotion: false,
	hoveredCountry: null,
	locale: 'en',
	showSettings: true,
	setRotationSpeed: v => set({ rotationSpeed: Math.max(0, Math.min(1.5, v)) }),
	setZoomSensitivity: v => set({ zoomSensitivity: Math.max(0.5, Math.min(2.5, v)) }),
	setReducedMotion: v => set({ reducedMotion: v }),
	setHoveredCountry: c => set({ hoveredCountry: c }),
	setLocale: l => set({ locale: l }),
	setShowSettings: v => set({ showSettings: v }),
}));


