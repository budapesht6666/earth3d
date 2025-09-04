import React from 'react';
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, Group, Color } from 'three';
import { latLonToVector3 } from '../utils/geo';

function buildGraticule(step = 10): BufferGeometry {
	const pts: number[] = [];
	// Meridians
	for (let lon = -180; lon <= 180; lon += step) {
		for (let lat = -90; lat < 90; lat += 2) {
			const a = latLonToVector3(lat, lon);
			const b = latLonToVector3(lat + 2, lon);
			pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
		}
	}
	// Parallels
	for (let lat = -80; lat <= 80; lat += step) {
		for (let lon = -180; lon < 180; lon += 2) {
			const a = latLonToVector3(lat, lon);
			const b = latLonToVector3(lat, lon + 2);
			pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
		}
	}
	const geom = new BufferGeometry();
	geom.setAttribute('position', new Float32BufferAttribute(new Float32Array(pts), 3));
	return geom;
}

export const Graticule: React.FC = () => {
	const ref = React.useRef<Group>(null);
	React.useEffect(() => {
		if (!ref.current) return;
		const material = new LineBasicMaterial({ color: new Color('#4a5672'), linewidth: 1 });
		const geom = buildGraticule(15);
		const lines = new LineSegments(geom, material);
		ref.current.add(lines);
		return () => { ref.current?.clear(); };
	}, []);
	return <group ref={ref} />;
};


