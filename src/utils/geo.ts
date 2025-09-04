import { Vector3 } from 'three';

export function latLonToVector3(latDeg: number, lonDeg: number, radius = 1): Vector3 {
	const lat = (latDeg * Math.PI) / 180;
	const lon = (lonDeg * Math.PI) / 180;
	const x = radius * Math.cos(lat) * Math.cos(lon);
	const y = radius * Math.sin(lat);
	const z = radius * Math.cos(lat) * Math.sin(lon);
	return new Vector3(x, y, z);
}


