export type LocaleKey = 'en' | 'ru';

export const messages: Record<LocaleKey, Record<string, string>> = {
	en: {
		settings: 'Settings',
		rotationSpeed: 'Rotation speed',
		zoomSensitivity: 'Zoom sensitivity',
		pauseOnHover: 'Pause on hover',
		language: 'Language',
	},
	ru: {
		settings: 'Настройки',
		rotationSpeed: 'Скорость вращения',
		zoomSensitivity: 'Чувствительность масштаба',
		pauseOnHover: 'Пауза при наведении',
		language: 'Язык',
	},
};

export function getUserLocale(): LocaleKey {
	const lang = (navigator.language || 'en').toLowerCase();
	if (lang.startsWith('ru')) return 'ru';
	return 'en';
}


