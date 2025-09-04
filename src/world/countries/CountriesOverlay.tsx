import React from 'react';
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, Group, Vector3, Color, PerspectiveCamera } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { loadCountriesTopo } from '../../utils/data';
import { latLonToVector3 } from '../../utils/geo';
import { useAppStore } from '../../utils/store';

type CountryLine = { id: string; name: string; iso_a3: string; positions: Float32Array };

function buildLineGeometry(coords: number[][]): BufferGeometry {
	const points: number[] = [];
	for (let i = 0; i < coords.length - 1; i++) {
		const a = coords[i];
		const b = coords[i + 1];
		const va = latLonToVector3(a[1], a[0], 1.002);
		const vb = latLonToVector3(b[1], b[0], 1.002);
		points.push(va.x, va.y, va.z, vb.x, vb.y, vb.z);
	}
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(points), 3));
	return geometry;
}

export const CountriesOverlay: React.FC = () => {
	const groupRef = React.useRef<Group>(null);
	const setHovered = useAppStore(s => s.setHoveredCountry);
	const locale = useAppStore(s => s.locale);
	const hoverResumeDelayRef = React.useRef<number | null>(null);
	const baseMaterial = React.useMemo(
		() => new LineBasicMaterial({ color: new Color('#eaeef7'), linewidth: 1, depthTest: true }),
		[],
	);
	const highlightMaterial = React.useMemo(
		() => new LineBasicMaterial({ color: new Color('#ffcc00'), linewidth: 2, depthTest: true }),
		[],
	);
	const highlightedRef = React.useRef<LineSegments | null>(null);

	React.useEffect(() => {
		let mounted = true;
		loadCountriesTopo().then(dataset => {
			if (!mounted || !groupRef.current) return;
			const group = groupRef.current;
			group.clear();
			const material = new LineBasicMaterial({ color: new Color('#eaeef7'), linewidth: 1, depthTest: false });
			for (const feature of dataset.features) {
				// For MVP draw only outer rings as lines
				const multi = feature.geometry.type === 'MultiPolygon';
				const polys = multi ? feature.geometry.coordinates : [feature.geometry.coordinates];
				for (const poly of polys) {
					// first ring is outer
					const ring = poly[0];
					const geom = buildLineGeometry(ring as number[][]);
					const line = new LineSegments(geom, baseMaterial);
					// Determine localized name and ISO code
					const props = feature.properties as {
						name?: string; NAME?: string; name_en?: string; name_ru?: string;
						iso_a3?: string; A3?: string; iso_n3?: string;
					};
					const name = locale === 'ru'
						? (props?.name_ru || props?.name || props?.NAME || props?.name_en || '')
						: (props?.name_en || props?.name || props?.NAME || props?.name_ru || '');
					const iso = props?.iso_a3 || props?.A3 || props?.iso_n3 || '';
					line.userData = { iso_a3: iso, name };
					group.add(line);
				}
			}
		});
		return () => { mounted = false; };
	}, [baseMaterial, locale]);

	// Basic hover via HTML tooltip is handled by raycast from pointer
	const { raycaster, camera, pointer, clock } = useThree();
	useFrame(() => {
		if (!groupRef.current) return;
		raycaster.params.Line = { threshold: 0.03 };
		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(groupRef.current.children, false);
		const cam = camera as PerspectiveCamera;
		const frontHit = intersects.find(hit => hit.point.dot(cam.position) > 0);
		const prev = highlightedRef.current;
		if (frontHit) {
			const data = frontHit.object.userData;
			setHovered({ iso_a3: data.iso_a3, name: data.name });
			const current = frontHit.object as LineSegments;
			if (prev && prev !== current) {
				prev.material = baseMaterial;
				prev.scale.setScalar(1.0);
			}
			highlightedRef.current = current;
			current.material = highlightMaterial;
			current.scale.setScalar(1.01);
		} else {
			setHovered(null);
			if (prev) {
				prev.material = baseMaterial;
				prev.scale.setScalar(1.0);
				highlightedRef.current = null;
			}
		}
	});

	return <group ref={groupRef} />;
};


