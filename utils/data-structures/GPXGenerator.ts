import { GeometryTypeNames } from '@/data/routes';
import {
  GPXMetadata,
  GPXOptions,
  LngLat,
  MapFeature,
  MapLayer,
} from '@/types/maps';

export class GPXGenerator {
  metadata: GPXMetadata;
  mapLayers: MapLayer[];
  options: GPXOptions;
  xml: string = '';

  constructor(
    metadata: Partial<GPXMetadata>,
    mapLayers: MapLayer[],
    options?: Partial<GPXOptions>
  ) {
    this.metadata = {
      name: metadata.name || null,
      desc: metadata.desc || null,
      author: metadata.author || null,
      copyright: metadata.copyright || null,
      link: metadata.link || null,
      time: metadata.time || null,
      keywords: metadata.keywords || null,
      bounds: metadata.bounds || null,
    };
    this.mapLayers = mapLayers;
    this.options = {
      fileName: `${options?.fileName || 'untitled'}.gpx`,
    };

    this.generate();
  }

  private generate() {
    this.xml = `<?xml version="1.0" encoding="UTF-8"?>` + '\n';

    this.xml +=
      `<gpx creator="OutRoutes https://outroutes.staffordrose.com" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">` +
      '\n';

    this.addMetadata();

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

  private addMetadata() {
    this.xml += this.indent() + `<metadata>` + '\n';

    // name
    if (this.metadata.name) {
      this.xml += this.indent(2) + `<name>${this.metadata.name}</name>` + '\n';
    }
    // description
    if (this.metadata.desc) {
      this.xml += this.indent(2) + `<desc>${this.metadata.desc}</desc>` + '\n';
    }
    // author
    if (this.metadata.author?.name) {
      const author = [
        this.indent(2) + `<author>`,
        this.indent(3) + `<name>${this.metadata.author.name}</name>`,
      ];
      if (this.metadata.author.email?.id && this.metadata.author.email.domain) {
        author.push(
          this.indent(3) +
            `<email id="${this.metadata.author.email.id}" domain="${this.metadata.author.email.domain}" />`
        );
      }
      if (this.metadata.author.link?.href) {
        const link = [
          this.indent(3) + `<link href="${this.metadata.author.link.href}">`,
          this.indent(4) + `<text>${this.metadata.author.link.text}</text>`,
          this.indent(4) + `<type>${this.metadata.author.link.type}</type>`,
          this.indent(3) + `</link>`,
        ];
        author.push(link.join('\n'));
      }
      author.push(this.indent(2) + `</author>`);
      this.xml += author.join('\n') + '\n';
    }
    // copyright
    if (this.metadata.copyright?.author) {
      const copyright = [
        this.indent(2) +
          `<copyright author="${this.metadata.copyright.author}">`,
      ];
      if (this.metadata.copyright.year) {
        copyright.push(
          this.indent(3) + `<year>${this.metadata.copyright.year}</year>`
        );
      }
      if (this.metadata.copyright.license) {
        copyright.push(
          this.indent(3) +
            `<license>${this.metadata.copyright.license}</license>`
        );
      }
      copyright.push(this.indent(2) + `</copyright>`);
      this.xml += copyright.join('\n') + '\n';
    }
    // link
    if (this.metadata.link?.href && this.metadata.link.text) {
      const link = [
        this.indent(2) + `<link href="${this.metadata.link.href}">`,
        this.indent(3) + `<text>${this.metadata.link.text}</text>`,
      ];
      if (this.metadata.link.type) {
        link.push(this.indent(3) + `<type>${this.metadata.link.type}</type>`);
      }
      link.push(this.indent(2) + `</link>`);
      this.xml += link.join('\n') + '\n';
    }
    // time
    if (this.metadata.time) {
      this.xml += this.indent(2) + `<time>${this.metadata.time}</time>` + '\n';
    }
    // keywords
    if (
      Array.isArray(this.metadata.keywords) &&
      this.metadata.keywords.length
    ) {
      this.xml +=
        this.indent(2) +
        `<keywords>${this.metadata.keywords.join(', ')}</keywords>`;
    }
    // bounds
    if (Array.isArray(this.metadata.bounds) && this.metadata.bounds.length) {
      const [[minlon, minlat], [maxlon, maxlat]] = this.metadata.bounds;
      this.xml +=
        this.indent(2) +
        `<bounds minlat="${minlat}" minlon="${minlon}" maxlat="${maxlat}" maxlon="${maxlon}" />` +
        '\n';
    }

    this.xml += this.indent() + `</metadata>` + '\n';
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
    link.download = this.options.fileName;
    document.body.appendChild(link);
    link.click();
  }
}
