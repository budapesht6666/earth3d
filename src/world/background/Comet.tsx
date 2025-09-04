import React from 'react';
import { Color } from 'three';
import type { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Trail } from '@react-three/drei';

export const Comet: React.FC = () => {
	const groupRef = React.useRef<Group>(null);
	const [speed] = React.useState(() => 0.6 + Math.random() * 0.4);

	useFrame((_, delta) => {
		if (!groupRef.current) return;
		groupRef.current.position.x += delta * speed * 2;
		groupRef.current.position.y += Math.sin(groupRef.current.position.x * 0.5) * 0.005;
		if (groupRef.current.position.x > 8) {
			groupRef.current.position.x = -8;
			groupRef.current.position.y = Math.random() * 4 - 2;
			groupRef.current.position.z = -6 - Math.random() * 4;
		}
	});

	return (
		<group ref={groupRef} position={[-8, 1.5, -8]} rotation={[0, 0.2, 0]}>
			<Trail
				width={2.5}
				color={new Color('#fff2b3')}
				length={6}
				decay={2.5}
				attenuation={(t: number) => Math.pow(t, 2)}
			>
				<Billboard>
					<mesh>
						<circleGeometry args={[0.18, 32]} />
						<meshBasicMaterial color={'#fff7cc'} transparent opacity={0.95} />
					</mesh>
				</Billboard>
			</Trail>
		</group>
	);
};


