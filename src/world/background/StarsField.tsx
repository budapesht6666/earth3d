import React from 'react';
import { Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';

export const StarsField: React.FC = () => {
	const groupRef = React.useRef<Group>(null);
	const { pointer } = useThree();

	useFrame((_, delta) => {
		if (!groupRef.current) return;
		// Slow drift rotation
		groupRef.current.rotation.y += delta * 0.01;
		// Light parallax with pointer
		groupRef.current.rotation.x = pointer.y * 0.08;
		groupRef.current.rotation.z = pointer.x * 0.08;
	});

	return (
		<group ref={groupRef} position={[0, 0, -10]}>
			<Stars radius={200} depth={60} count={6000} factor={2} saturation={0} fade speed={0.4} />
		</group>
	);
};


