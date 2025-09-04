import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, StatsGl } from '@react-three/drei';
import { SceneRoot } from '../world/SceneRoot';
import { Tooltip } from './Tooltip';
import { SettingsPanel } from './SettingsPanel';
import { useAppStore } from '../utils/store';
import { CameraZoom } from '../world/CameraZoom';

export const App: React.FC = () => {
	const showStats = false;
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const setReduced = useAppStore(s => s.setReducedMotion);
	const showSettings = useAppStore(s => s.showSettings);
	const setShowSettings = useAppStore(s => s.setShowSettings);
	React.useEffect(() => { setReduced(reducedMotion); }, [reducedMotion, setReduced]);

	return (
		<>
			<Canvas
				shadows={false}
				gl={{ antialias: true }}
				camera={{ fov: 55, position: [0, 0, 3] }}
			>
				<ambientLight intensity={0.6} />
				<directionalLight position={[3, 2, 2]} intensity={0.8} />
				<SceneRoot />
				<CameraZoom />
				<OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
				{showStats && <StatsGl />}
			</Canvas>
			<Tooltip />
			{showSettings && <SettingsPanel />}
			<button
				aria-label="Settings"
				aria-pressed={showSettings}
				onClick={() => setShowSettings(!showSettings)}
				style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer' }}
			>
				<img src="./icons/settings-2.svg" alt="" width={24} height={24} />
			</button>
		</>
	);
};


