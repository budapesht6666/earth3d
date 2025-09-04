import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, SphereGeometry, MeshStandardMaterial, Group, MathUtils } from 'three';
import { useAppStore } from '../utils/store';
import { CountriesOverlay } from './countries/CountriesOverlay';
import { Graticule } from './Graticule';
import { StarsField } from './background/StarsField';
import { PillarsNebula } from './background/PillarsNebula';
import { Comet } from './background/Comet';

export const SceneRoot: React.FC = () => {
	const groupRef = React.useRef<Group>(null);
	const rotationSpeed = useAppStore(s => s.rotationSpeed);
	const reducedMotion = useAppStore(s => s.reducedMotion);
	const { gl } = useThree();

	// Drag state
	const isDraggingRef = React.useRef<boolean>(false);
	const lastPosRef = React.useRef<{ x: number; y: number } | null>(null);
	const dragPointerIdRef = React.useRef<number | null>(null);
	const activeTouchesRef = React.useRef<Set<number>>(new Set());

	React.useEffect(() => {
		const el = gl.domElement;
		let pointerIsDown = false; // true only while we're actively dragging (mouse or single touch)

		const onPointerDown = (e: PointerEvent) => {
			if (e.pointerType === 'mouse') {
				// Mouse: left button only
				if (e.button !== 0) return;
				pointerIsDown = true;
				isDraggingRef.current = true;
				lastPosRef.current = { x: e.clientX, y: e.clientY };
				dragPointerIdRef.current = e.pointerId;
				try { (el as HTMLElement).setPointerCapture?.(e.pointerId); } catch {}
				(el as HTMLElement).style.cursor = 'grabbing';
				return;
			}

			if (e.pointerType === 'touch') {
				// Track active touches
				activeTouchesRef.current.add(e.pointerId);
				// Start drag only when exactly one touch is active
				if (activeTouchesRef.current.size === 1 && !isDraggingRef.current) {
					pointerIsDown = true;
					isDraggingRef.current = true;
					lastPosRef.current = { x: e.clientX, y: e.clientY };
					dragPointerIdRef.current = e.pointerId;
					return;
				}
				// If a second touch appears while dragging, stop dragging (pinch takes over)
				if (activeTouchesRef.current.size >= 2 && isDraggingRef.current) {
					pointerIsDown = false;
					isDraggingRef.current = false;
					lastPosRef.current = null;
					dragPointerIdRef.current = null;
				}
			}
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!pointerIsDown || !groupRef.current) return;
			// For touch dragging, only react to the finger that initiated drag
			if (e.pointerType === 'touch' && dragPointerIdRef.current !== e.pointerId) return;
			const last = lastPosRef.current;
			if (!last) {
				lastPosRef.current = { x: e.clientX, y: e.clientY };
				return;
			}
			const dx = e.clientX - last.x;
			const dy = e.clientY - last.y;
			lastPosRef.current = { x: e.clientX, y: e.clientY };

			const ROTATION_PER_PIXEL = 0.005; // radians per pixel
			// Horizontal drag -> yaw (around Y) inverted
			groupRef.current.rotation.y += dx * ROTATION_PER_PIXEL;
			// Vertical drag -> pitch (around X) inverted with clamp
			const nextX = groupRef.current.rotation.x + dy * ROTATION_PER_PIXEL;
			groupRef.current.rotation.x = MathUtils.clamp(nextX, -Math.PI / 2 + 0.2, Math.PI / 2 - 0.2);
		};

		const onPointerUpOrCancel = (e: PointerEvent) => {
			if (e.pointerType === 'touch') {
				activeTouchesRef.current.delete(e.pointerId);
			}
			// End drag if this pointer was controlling the drag, or if it's mouse
			if (dragPointerIdRef.current === e.pointerId || e.pointerType === 'mouse') {
				pointerIsDown = false;
				isDraggingRef.current = false;
				lastPosRef.current = null;
				dragPointerIdRef.current = null;
				(el as HTMLElement).style.cursor = 'default';
			}
		};

		const endAll = () => {
			pointerIsDown = false;
			isDraggingRef.current = false;
			lastPosRef.current = null;
			dragPointerIdRef.current = null;
			activeTouchesRef.current.clear();
			(el as HTMLElement).style.cursor = 'default';
		};

		el.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUpOrCancel);
		window.addEventListener('pointercancel', onPointerUpOrCancel);
		window.addEventListener('blur', endAll);

		return () => {
			el.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUpOrCancel);
			window.removeEventListener('pointercancel', onPointerUpOrCancel);
			window.removeEventListener('blur', endAll);
		};
	}, [gl]);

	useFrame((_, delta) => {
		if (!groupRef.current) return;
		const isPaused = reducedMotion || isDraggingRef.current;
		if (isPaused) return;
		groupRef.current.rotation.y += delta * rotationSpeed;
	});

	return (
		<group ref={groupRef}>
			{/* Background universe */}
			<StarsField />
			<PillarsNebula />
			<Comet />

			<mesh>
				<sphereGeometry args={[1, 64, 64]} />
				<meshStandardMaterial color={0x0b3d91} roughness={0.9} metalness={0.0} transparent={false} opacity={1} />
			</mesh>
			<Graticule />
			<CountriesOverlay />
		</group>
	);
};


