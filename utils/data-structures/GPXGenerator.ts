import { GeometryTypeNames, SymbolCodes, symbolLabels } from '@/data/routes';
import {
  GPXAuthor,
  GPXCopyright,
  GPXMetadata,
  GPXOptions,
  GPXLink,
  LngLat,
  MapFeature,
  MapLayer,
} from '@/types/maps';
import { roundToDecimalCount } from '../arithmetic';

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

  private generate(): void {
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
          this.addRoute(feature);
        }
      });
    });

    this.xml += `</gpx>`;
  }

  private addMetadata(): void {
    this.xml += this.indent() + `<metadata>` + '\n';

    // name
    if (this.metadata.name) {
      this.xml += this.addName(this.metadata.name);
    }
    // description
    if (this.metadata.desc) {
      this.xml += this.addDescription(this.metadata.desc);
    }
    // author
    if (this.metadata.author?.name) {
      this.xml += this.addAuthor(this.metadata.author);
    }
    // copyright
    if (this.metadata.copyright?.author) {
      this.xml += this.addCopyright(this.metadata.copyright);
    }
    // link
    if (this.metadata.link?.href && this.metadata.link.text) {
      this.xml += this.addLink(this.metadata.link);
    }
    // time
    if (this.metadata.time) {
      this.xml += this.addTime(this.metadata.time);
    }
    // keywords
    if (
      Array.isArray(this.metadata.keywords) &&
      this.metadata.keywords.length
    ) {
      this.xml += this.addKeywords(this.metadata.keywords);
    }
    // bounds
    if (Array.isArray(this.metadata.bounds) && this.metadata.bounds.length) {
      this.xml += this.addBounds(this.metadata.bounds);
    }

    this.xml += this.indent() + `</metadata>` + '\n';
  }

  private addName(name: string): string {
    return this.indent(2) + `<name>${name}</name>` + '\n';
  }

  private addDescription(desc: string): string {
    return this.indent(2) + `<desc>${desc}</desc>` + '\n';
  }

  private addAuthor({ name, email, link }: GPXAuthor): string {
    const author = [
      this.indent(2) + `<author>`,
      this.indent(3) + `<name>${name}</name>`,
    ];
    if (email?.id && email.domain) {
      author.push(
        this.indent(3) + `<email id="${email.id}" domain="${email.domain}" />`
      );
    }
    if (link?.href) {
      const linkArr = [
        this.indent(3) + `<link href="${link.href}">`,
        this.indent(4) + `<text>${link.text}</text>`,
        this.indent(4) + `<type>${link.type}</type>`,
        this.indent(3) + `</link>`,
      ];
      author.push(linkArr.join('\n'));
    }
    author.push(this.indent(2) + `</author>`);

    return author.join('\n') + '\n';
  }

  private addCopyright({ author, year, license }: GPXCopyright): string {
    const copyright = [this.indent(2) + `<copyright author="${author}">`];
    if (year) {
      copyright.push(this.indent(3) + `<year>${year}</year>`);
    }
    if (license) {
      copyright.push(this.indent(3) + `<license>${license}</license>`);
    }
    copyright.push(this.indent(2) + `</copyright>`);

    return copyright.join('\n') + '\n';
  }

  private addLink({ href, text, type }: GPXLink): string {
    const link = [
      this.indent(2) + `<link href="${href}">`,
      this.indent(3) + `<text>${text}</text>`,
    ];
    if (type) {
      link.push(this.indent(3) + `<type>${type}</type>`);
    }
    link.push(this.indent(2) + `</link>`);

    return link.join('\n') + '\n';
  }

  private addTime(time: Date): string {
    return this.indent(2) + `<time>${time.toISOString()}</time>` + '\n';
  }

  private addKeywords(keywords: string[]): string {
    return (
      this.indent(2) + `<keywords>${keywords.join(', ')}</keywords>` + '\n'
    );
  }

  private addBounds([[minlon, minlat], [maxlon, maxlat]]: LngLat[]): string {
    return (
      this.indent(2) +
      `<bounds minlat="${minlat}" minlon="${minlon}" maxlat="${maxlat}" maxlon="${maxlon}" />` +
      '\n'
    );
  }

  private addWaypoint({
    geometry: { coordinates },
    properties,
  }: MapFeature): void {
    const wpt = [
      this.indent() + `<wpt lat="${coordinates[1]}" lon="${coordinates[0]}">`,
      this.indent(2) +
        `<ele>${roundToDecimalCount(properties.ele_start || 0, {
          decimalCount: 4,
        }).toFixed(4)}</ele>`,
      this.indent(2) + `<name>${properties.title || ''}</name>`,
    ];
    if (properties.description) {
      wpt.push(this.indent(2) + `<desc>${properties.description}</desc>`);
    }
    if (properties.symbol && symbolLabels[properties.symbol as SymbolCodes]) {
      wpt.push(
        this.indent(2) +
          `<sym>${symbolLabels[properties.symbol as SymbolCodes]}</sym>`
      );
    }
    wpt.push(this.indent() + `</wpt>`);

    this.xml += wpt.join('\n') + '\n';
  }

  private addRoute({
    geometry: { coordinates },
    properties,
  }: MapFeature): void {
    const rte = [
      this.indent() + `<rte>`,
      this.indent(2) + `<name>${properties.title || ''}</name>`,
    ];
    if (properties.description) {
      rte.push(this.indent(2) + `<desc>${properties.description}</desc>`);
    }
    (coordinates as LngLat[]).forEach((curr, index) => {
      const rtept = [
        this.indent(2) + `<rtept lat="${curr[1]}" lon="${curr[0]}">`,
        this.indent(3) + `<ele>${(0).toFixed(4)}</ele>`,
        this.indent(2) + `</rtept>`,
      ];
      rte.push(rtept.join('\n'));
    });
    rte.push(this.indent() + `</rte>`);

    this.xml += rte.join('\n') + '\n';
  }

  private indent(count: number | undefined = 1): string {
    return Array.from({ length: count }, () => '  ').join('');
  }

  download(): void {
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,` + this.xml;
    link.download = this.options.fileName;
    document.body.appendChild(link);
    link.click();
  }
}
