import React from 'react';
import { useAppStore } from '../utils/store';
import { messages, getUserLocale } from '../i18n';

export const SettingsPanel: React.FC = () => {
	const rotationSpeed = useAppStore(s => s.rotationSpeed);
	const setRotationSpeed = useAppStore(s => s.setRotationSpeed);
	const zoomSensitivity = useAppStore(s => s.zoomSensitivity);
	const setZoomSensitivity = useAppStore(s => s.setZoomSensitivity);
	const locale = useAppStore(s => s.locale);
	const setLocale = useAppStore(s => s.setLocale);

	const t = messages[locale || getUserLocale()];
	return (
		<div className="settings" aria-label="Settings">
			
			<div className="controls">
				<label className="label">{t.rotationSpeed}: {(rotationSpeed).toFixed(2)}</label>
				<input className="range" type="range" min={0} max={1.5} step={0.01} value={rotationSpeed} onChange={e => setRotationSpeed(Number(e.target.value))} />
				<label className="label">{t.zoomSensitivity}: {zoomSensitivity.toFixed(2)}</label>
				<input className="range" type="range" min={0.5} max={2.5} step={0.1} value={zoomSensitivity} onChange={e => setZoomSensitivity(Number(e.target.value))} />
				<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
					<img src="./icons/languages.svg" alt="Language" width={18} height={18} style={{ opacity: 0.85 }} />
					<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
						<span style={{ fontSize: 12, opacity: 0.75 }}>RU</span>
						<button
							type="button"
							aria-label="Toggle language"
							onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
							style={{ width: 36, height: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)', position: 'relative' }}
						>
							<span style={{ position: 'absolute', top: 2, left: locale === 'ru' ? 2 : 18, width: 16, height: 16, borderRadius: 10, background: '#eaeef7' }} />
						</button>
						<span style={{ fontSize: 12, opacity: 0.75 }}>EN</span>
					</div>
				</div>
			</div>
		</div>
	);
};


