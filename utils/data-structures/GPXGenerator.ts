import { GeometryTypeNames } from '@/data/routes';
import { LngLat, MapFeature, MapLayer } from '@/types';

export class GPXGenerator {
  mapLayers: MapLayer[];
  fileName: string;
  xml: string = '';

  constructor(mapLayers: MapLayer[], fileName?: string) {
    this.mapLayers = mapLayers;
    this.fileName = `${fileName || 'untitled'}.gpx`;

    this.generate();
  }

  private generate() {
    this.xml = `<?xml version="1.0" encoding="UTF-8"?>` + '\n';

    this.xml +=
      `<gpx creator="Out Routes" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">` +
      '\n';
    this.xml += this.indent() + `<metadata />` + '\n';

    this.mapLayers.forEach(({ data }) => {
      (data.features || []).forEach((feature) => {
        if (feature.geometry.type === GeometryTypeNames.Point) {
          this.addWaypoint(feature);
        } else if (feature.geometry.type === GeometryTypeNames.LineString) {
          this.addTrack(feature);
        }
      });
    });

    this.xml += `</gpx>`;
  }

  private addWaypoint({ geometry: { coordinates }, properties }: MapFeature) {
    const wpt = [
      this.indent() + `<wpt lat="${coordinates[1]}" lon="${coordinates[0]}">`,
      this.indent(2) + `<ele>${properties.ele_start || 0}</ele>`,
      this.indent(2) + `<name>${properties.title || ''}</name>`,
      this.indent(2) + `<desc>${properties.description || ''}</desc>`,
      this.indent(2) + `<sym>${properties.symbol || ''}</sym>`,
      this.indent() + `</wpt>`,
    ];

    this.xml += wpt.join('\n') + '\n';
  }

  private addTrack({ geometry: { coordinates }, properties }: MapFeature) {
    let trk = [
      this.indent() + `<trk>`,
      this.indent(2) + `<name>${properties.title || ''}</name>`,
      this.indent(2) + `<desc>${properties.description || ''}</desc>`,
      this.indent(2) + `<trkseg>`,
    ];

    trk = trk.concat(
      (coordinates as LngLat[]).reduce((accum, curr, index) => {
        const trkpt = [
          this.indent(3) + `<trkpt lat="${curr[1]}" lon="${curr[0]}">`,
          this.indent(4) + `<ele>0</ele>`,
          this.indent(3) + `</trkpt>`,
        ];

        accum +=
          trkpt.join('\n') + (index < coordinates.length - 1 ? '\n' : '');

        return accum;
      }, '')
    );

    trk = trk.concat(
      [this.indent(2) + `</trkseg>`, this.indent() + `</trk>`].join('\n')
    );

    this.xml += trk.join('\n') + '\n';
  }

  private indent(count: number | undefined = 1): string {
    return Array.from({ length: count }, () => '  ').join('');
  }

  download() {
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,` + this.xml;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
  }
}
