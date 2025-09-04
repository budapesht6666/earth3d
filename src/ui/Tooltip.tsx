import React from 'react';
import { useAppStore } from '../utils/store';

export const Tooltip: React.FC = () => {
	const hovered = useAppStore(s => s.hoveredCountry);
	const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

	React.useEffect(() => {
		const onMove = (e: PointerEvent) => setPos({ x: e.clientX + 12, y: e.clientY + 12 });
		window.addEventListener('pointermove', onMove);
		return () => window.removeEventListener('pointermove', onMove);
	}, []);

	if (!hovered || !pos) return null;
	return (
		<div className="tooltip" style={{ left: pos.x, top: pos.y }} role="tooltip" aria-live="polite">
			<div>{hovered.name}</div>
			<div style={{ opacity: 0.7, fontSize: 11 }}>{hovered.iso_a3}</div>
		</div>
	);
};


