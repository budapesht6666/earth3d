import React from 'react';
import { AdditiveBlending, BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { useFrame } from '@react-three/fiber';

const fragment = `
uniform float u_time;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
varying vec3 vPos;

float noise(vec3 p) {
	return fract(sin(dot(p, vec3(12.9898,78.233,54.53))) * 43758.5453);
}

void main() {
	float n = noise(vPos * 2.0 + u_time * 0.05);
	float mask = smoothstep(0.3, 0.8, n);
	vec3 col = mix(u_colorA, u_colorB, mask);
	gl_FragColor = vec4(col, mask * 0.6);
}
`;

const vertex = `
varying vec3 vPos;
void main() {
	vPos = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const PillarsNebula: React.FC = () => {
	const meshRef = React.useRef<Mesh>(null);
	const matRef = React.useRef<ShaderMaterial>(null);

	useFrame((_, delta) => {
		if (!meshRef.current || !matRef.current) return;
		meshRef.current.rotation.y += delta * 0.005;
		matRef.current.uniforms.u_time.value += delta;
	});

	return (
		<mesh ref={meshRef} position={[0, 0, -20]}>
			<sphereGeometry args={[30, 64, 64]} />
			<shaderMaterial
				ref={matRef}
				args={[{
					uniforms: {
						u_time: { value: 0 },
						u_colorA: { value: new Color('#221733') },
						u_colorB: { value: new Color('#5a3a88') },
					},
					vertexShader: vertex,
					fragmentShader: fragment,
					transparent: true,
					blending: AdditiveBlending,
					depthWrite: false,
					side: BackSide,
				}]} 
			/>
		</mesh>
	);
};


