import React from 'react';
import { useThree } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import { useAppStore } from '../utils/store';

const FOV_MIN = 25;
const FOV_MAX = 75;

export const CameraZoom: React.FC = () => {
	const { camera, gl } = useThree();
	const sensitivity = useAppStore(s => s.zoomSensitivity);

	React.useEffect(() => {
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			const delta = Math.sign(e.deltaY);
			const factor = Math.exp(delta * 0.1 * sensitivity);
			const cam = camera as PerspectiveCamera;
			const next = cam.fov * factor;
			cam.fov = Math.min(FOV_MAX, Math.max(FOV_MIN, next));
			cam.updateProjectionMatrix();
		};
		const opts: AddEventListenerOptions = { passive: false };
		window.addEventListener('wheel', onWheel, opts);
		return () => window.removeEventListener('wheel', onWheel, opts);
	}, [camera, sensitivity]);

	// Pinch-to-zoom (touch)
	React.useEffect(() => {
		const el = gl.domElement as HTMLElement;
		let lastDistance: number | null = null;
		const activeTouches = new Map<number, { x: number; y: number }>();

		const updateCameraFov = (factor: number) => {
			const cam = camera as PerspectiveCamera;
			const next = cam.fov * factor;
			cam.fov = Math.min(FOV_MAX, Math.max(FOV_MIN, next));
			cam.updateProjectionMatrix();
		};

		const computeDistance = () => {
			if (activeTouches.size !== 2) return null;
			const it = activeTouches.values();
			const a = it.next().value as { x: number; y: number };
			const b = it.next().value as { x: number; y: number };
			const dx = a.x - b.x;
			const dy = a.y - b.y;
			return Math.hypot(dx, dy);
		};

		const onPointerDown = (e: PointerEvent) => {
			if (e.pointerType !== 'touch') return;
			e.preventDefault();
			activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (activeTouches.size === 2) {
				lastDistance = computeDistance();
			}
		};

		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType !== 'touch') return;
			if (!activeTouches.has(e.pointerId)) return;
			e.preventDefault();
			activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (activeTouches.size === 2) {
				const current = computeDistance();
				if (current && lastDistance && current > 0) {
					// factor < 1 => zoom in (decrease FOV) when distance increases
					const rawFactor = lastDistance / current;
					const factor = Math.pow(rawFactor, sensitivity);
					updateCameraFov(factor);
					lastDistance = current;
				}
			}
		};

		const onPointerUp = (e: PointerEvent) => {
			if (activeTouches.has(e.pointerId)) {
				activeTouches.delete(e.pointerId);
				if (activeTouches.size < 2) {
					lastDistance = null;
				}
			}
		};

		// Prevent browser touch gestures on the canvas
		const prevTouchAction = el.style.touchAction;
		el.style.touchAction = 'none';

		const opts: AddEventListenerOptions = { passive: false };
		el.addEventListener('pointerdown', onPointerDown, opts);
		window.addEventListener('pointermove', onPointerMove, opts);
		window.addEventListener('pointerup', onPointerUp, opts);
		window.addEventListener('pointercancel', onPointerUp, opts);

		return () => {
			el.style.touchAction = prevTouchAction;
			el.removeEventListener('pointerdown', onPointerDown, opts);
			window.removeEventListener('pointermove', onPointerMove, opts);
			window.removeEventListener('pointerup', onPointerUp, opts);
			window.removeEventListener('pointercancel', onPointerUp, opts);
		};
	}, [camera, gl, sensitivity]);

	return null;
};


