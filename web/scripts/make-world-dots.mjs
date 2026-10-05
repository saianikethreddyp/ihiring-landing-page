// Builds a dotted world map (land mask sampled on a lat/lon grid) -> content/world-dots.json
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import fs from 'node:fs';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const land = feature(topo, topo.objects.land);
const step = 2.4, dots = [];
for (let lat = 80; lat >= -58; lat -= step) for (let lon = -180; lon <= 180; lon += step) if (geoContains(land, [lon, lat])) dots.push([+lon.toFixed(1), +lat.toFixed(1)]);
fs.writeFileSync('content/world-dots.json', JSON.stringify(dots));
console.log('dots:', dots.length);
