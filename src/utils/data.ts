import { feature } from 'topojson-client';
import type { GeometryObject, Topology } from 'topojson-specification';
import type { Feature, FeatureCollection } from 'geojson';

type AnyFeatureCollection = FeatureCollection | Feature;

export type CountryFeature = {
	type: 'Feature';
	properties: { name_en?: string; name_ru?: string; iso_a3: string };
	geometry:
		| { type: 'Polygon'; coordinates: number[][][] }
		| { type: 'MultiPolygon'; coordinates: number[][][][] };
};

export type CountryFeatureCollection = {
	type: 'FeatureCollection';
	features: CountryFeature[];
};

export async function loadCountriesTopo(): Promise<CountryFeatureCollection> {
	try {
		const res = await fetch('/data/countries-110m.topojson');
		if (!res.ok) throw new Error('Failed to load countries');
		const topo = (await res.json()) as Topology;
		if (!topo || !topo.objects) return { type: 'FeatureCollection', features: [] };
		const objects = topo.objects as Record<string, GeometryObject>;
		const objKey = Object.keys(objects)[0];
		if (!objKey) return { type: 'FeatureCollection', features: [] };
		const out = feature(topo, objects[objKey]) as AnyFeatureCollection;
		if (out.type === 'FeatureCollection') {
			return out as CountryFeatureCollection;
		}
		return { type: 'FeatureCollection', features: [out as Feature as unknown as CountryFeature] };
	} catch {
		// Fallback to CDN world-atlas dataset if local file is missing
		try {
			const cdn = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
			if (!cdn.ok) throw new Error('CDN fetch failed');
			const topo = (await cdn.json()) as Topology;
			const objects = topo.objects as Record<string, GeometryObject>;
			const objKey = Object.keys(objects)[0];
			if (!objKey) return { type: 'FeatureCollection', features: [] };
			const out = feature(topo, objects[objKey]) as AnyFeatureCollection;
			if (out.type === 'FeatureCollection') {
				return out as CountryFeatureCollection;
			}
			return { type: 'FeatureCollection', features: [out as Feature as unknown as CountryFeature] };
		} catch {
			return { type: 'FeatureCollection', features: [] };
		}
	}
}


