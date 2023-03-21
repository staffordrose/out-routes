import { Position } from 'geojson';

import { StandardColorCodes, standardColorNames } from '@/data/general';
import {
  activityTypeLabels,
  ActivityTypes,
  GeometryTypeNames,
  SymbolCodes,
  symbolLabels,
} from '@/data/routes';
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
import { Route } from '@/types/routes';
import { round } from '../arithmetic';

export class GPXGenerator {
  metadata: GPXMetadata;
  activityType: Route['activity_type'];
  mapLayers: MapLayer[];
  options: GPXOptions;
  xml: string = '';

  constructor(
    metadata: Partial<GPXMetadata>,
    activityType: Route['activity_type'],
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
    this.activityType = activityType;
    this.mapLayers = mapLayers;
    this.options = {
      fileName: `${options?.fileName || 'untitled'}.gpx`,
    };

    this.generate();
  }

  private generate(): void {
    this.xml = `<?xml version="1.0" encoding="UTF-8"?>` + '\n';

    const schemaLocation = [
      `http://www.topografix.com/GPX/1/1`,
      `http://www.topografix.com/GPX/1/1/gpx.xsd`,
      // Section extension
      `https://outroutes.staffordrose.com/xmlschemas/GpxExtensions/v1`,
      `https://outroutes.staffordrose.com/xmlschemas/GpxExtensionsv1.xsd`,
      // DisplayColor extension
      `http://www.garmin.com/xmlschemas/GpxExtensions/v3`,
      `http://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd`,
      // TransportationMode extension
      `http://www.garmin.com/xmlschemas/TripExtensions/v1`,
      `http://www.garmin.com/xmlschemas/TripExtensionsv1.xsd`,
    ];

    const gpxAttributes = [
      `creator="OutRoutes https://outroutes.staffordrose.com"`,
      `version="1.1"`,
      `xmlns="http://www.topografix.com/GPX/1/1"`,
      `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
      `xmlns:gpxout="https://outroutes.staffordrose.com/xmlschemas/GpxExtensions/v1"`,
      `xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"`,
      `xmlns:gpxtrx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"`,
      `xmlns:trp="http://www.garmin.com/xmlschemas/TripExtensions/v1"`,
      `xsi:schemaLocation="${schemaLocation.join(' ')}"`,
    ];

    this.xml += `<gpx ${gpxAttributes.join(' ')}>` + '\n';

    this.addMetadata();

    this.mapLayers.forEach(({ title, data }) => {
      (data.features || []).forEach((feature) => {
        if (feature.geometry.type === GeometryTypeNames.Point) {
          this.addWaypoint({ title }, feature);
        } else if (feature.geometry.type === GeometryTypeNames.LineString) {
          this.addRoute({ title }, feature);
        }
      });
    });

    this.xml += `</gpx>`;
  }

  private addMetadata(): void {
    const { name, desc, author, copyright, link, time, keywords, bounds } =
      this.metadata;

    this.xml += this.indent() + `<metadata>` + '\n';

    if (name) {
      this.xml += this.addName(name) + '\n';
    }
    if (desc) {
      this.xml += this.addDescription(desc) + '\n';
    }
    if (author?.name) {
      this.xml += this.addAuthor(author) + '\n';
    }
    if (copyright?.author) {
      this.xml += this.addCopyright(copyright) + '\n';
    }
    if (link?.href && link.text) {
      this.xml += this.addLink(link) + '\n';
    }
    if (time) {
      this.xml += this.addTime(time) + '\n';
    }
    if (Array.isArray(keywords) && keywords.length) {
      this.xml += this.addKeywords(keywords) + '\n';
    }
    if (Array.isArray(bounds) && bounds.length) {
      this.xml += this.addBounds(bounds) + '\n';
    }

    this.xml += this.indent() + `</metadata>` + '\n';
  }

  private addName(name: string, baseIndent = 2): string {
    return this.indent(baseIndent) + `<name>${name}</name>`;
  }

  private addDescription(desc: string, baseIndent = 2): string {
    return this.indent(baseIndent) + `<desc>${desc}</desc>`;
  }

  private addAuthor({ name, email, link }: GPXAuthor, baseIndent = 2): string {
    const author = [
      this.indent(baseIndent) + `<author>`,
      this.indent(baseIndent + 1) + `<name>${name}</name>`,
    ];
    if (email?.id && email.domain) {
      author.push(
        this.indent(baseIndent + 1) +
          `<email id="${email.id}" domain="${email.domain}" />`
      );
    }
    if (link?.href) {
      author.push(this.addLink(link, baseIndent + 1));
    }
    author.push(this.indent(baseIndent) + `</author>`);

    return author.join('\n');
  }

  private addCopyright(
    { author, year, license }: GPXCopyright,
    baseIndent = 2
  ): string {
    const copyright = [
      this.indent(baseIndent) + `<copyright author="${author}">`,
    ];
    if (year) {
      copyright.push(this.indent(baseIndent + 1) + `<year>${year}</year>`);
    }
    if (license) {
      copyright.push(
        this.indent(baseIndent + 1) + `<license>${license}</license>`
      );
    }
    copyright.push(this.indent(baseIndent) + `</copyright>`);

    return copyright.join('\n');
  }

  private addLink({ href, text, type }: GPXLink, baseIndent = 2): string {
    const link = [
      this.indent(baseIndent) + `<link href="${href}">`,
      this.indent(baseIndent + 1) + `<text>${text}</text>`,
    ];
    if (type) {
      link.push(this.indent(baseIndent + 1) + `<type>${type}</type>`);
    }
    link.push(this.indent(baseIndent) + `</link>`);

    return link.join('\n');
  }

  private addTime(time: Date, baseIndent = 2): string {
    return this.indent(baseIndent) + `<time>${time.toISOString()}</time>`;
  }

  private addKeywords(keywords: string[], baseIndent = 2): string {
    return (
      this.indent(baseIndent) + `<keywords>${keywords.join(', ')}</keywords>`
    );
  }

  private addBounds(
    [[minlon, minlat], [maxlon, maxlat]]: LngLat[],
    baseIndent = 2
  ): string {
    return (
      this.indent(baseIndent) +
      `<bounds minlat="${minlat}" minlon="${minlon}" maxlat="${maxlat}" maxlon="${maxlon}" />`
    );
  }

  private addWaypoint(
    { title }: Partial<MapLayer>,
    { geometry: { coordinates }, properties }: MapFeature,
    baseIndent = 1
  ): void {
    const wpt = [
      this.indent(baseIndent) +
        `<wpt lat="${(coordinates as Position)[1]}" lon="${
          (coordinates as Position)[0]
        }">`,
      this.indent(baseIndent + 1) +
        `<ele>${round((coordinates as Position)[2] || 0, 3).toFixed(4)}</ele>`,
      this.indent(baseIndent + 1) + `<name>${properties.title || ''}</name>`,
    ];
    // description
    if (properties.description) {
      wpt.push(
        this.indent(baseIndent + 1) + `<desc>${properties.description}</desc>`
      );
    }
    // symbol
    if (properties.symbol && symbolLabels[properties.symbol as SymbolCodes]) {
      wpt.push(
        this.indent(baseIndent + 1) +
          `<sym>${symbolLabels[properties.symbol as SymbolCodes]}</sym>`
      );
    }
    // extensions
    wpt.push(this.indent(baseIndent + 1) + `<extensions>`);
    // section
    wpt.push(this.addSectionExtension('Waypoint', title, baseIndent + 2));
    // display color
    if (
      (properties.color &&
        standardColorNames[properties.color as StandardColorCodes]) ||
      (properties.layerColor &&
        standardColorNames[properties.layerColor as StandardColorCodes])
    ) {
      wpt.push(
        this.addDisplayColorExtension('Waypoint', properties, baseIndent + 2)
      );
    }
    // extensions closing tag
    wpt.push(this.indent(baseIndent + 1) + `</extensions>`);
    // waypoint closing tag
    wpt.push(this.indent(baseIndent) + `</wpt>`);

    this.xml += wpt.join('\n') + '\n';
  }

  private addRoute(
    { title }: Partial<MapLayer>,
    { geometry: { coordinates }, properties }: MapFeature,
    baseIndent = 1
  ): void {
    const rte = [
      this.indent(baseIndent) + `<rte>`,
      this.indent(baseIndent + 1) + `<name>${properties.title || ''}</name>`,
    ];
    // description
    if (properties.description) {
      rte.push(
        this.indent(baseIndent + 1) + `<desc>${properties.description}</desc>`
      );
    }
    // extensions
    rte.push(this.indent(baseIndent + 1) + `<extensions>`);
    // section
    rte.push(this.addSectionExtension('Route', title, baseIndent + 2));
    // display color
    if (
      (properties.color &&
        standardColorNames[properties.color as StandardColorCodes]) ||
      (properties.layerColor &&
        standardColorNames[properties.layerColor as StandardColorCodes])
    ) {
      rte.push(
        this.addDisplayColorExtension('Route', properties, baseIndent + 2)
      );
    }
    // transportation mode
    if (this.activityType) {
      rte.push(
        this.addTransportationModeExtension(this.activityType, baseIndent + 2)
      );
    }
    // extensions closing tag
    rte.push(this.indent(baseIndent + 1) + `</extensions>`);
    // routepoints
    (coordinates as Position[]).forEach((position) => {
      const rtept = [
        this.indent(baseIndent + 1) +
          `<rtept lat="${position[1]}" lon="${position[0]}">`,
        this.indent(baseIndent + 2) + `<ele>${position[2] || 0}</ele>`,
        this.indent(baseIndent + 1) + `</rtept>`,
      ];
      rte.push(rtept.join('\n'));
    });
    // route closing tag
    rte.push(this.indent(baseIndent) + `</rte>`);

    this.xml += rte.join('\n') + '\n';
  }

  private addSectionExtension(
    featType: 'Waypoint' | 'Route' | 'Track',
    title: string | null | undefined,
    baseIndent = 1
  ): string {
    const section = [
      this.indent(baseIndent) + `<gpxout:${featType}Extension>`,
      this.indent(baseIndent + 1) +
        `<gpxout:Section>${title || '[Untitled section]'}</gpxout:Section>`,
      this.indent(baseIndent) + `</gpxout:${featType}Extension>`,
    ];

    return section.join('\n');
  }

  private addDisplayColorExtension(
    featType: 'Waypoint' | 'Route' | 'Track',
    { color, layerColor }: Partial<MapFeature['properties']>,
    baseIndent = 1
  ): string {
    const displayColor = [
      this.indent(baseIndent) + `<gpxx:${featType}Extension>`,
      this.indent(baseIndent + 1) +
        `<gpxx:DisplayColor>${
          color
            ? standardColorNames[color as StandardColorCodes]
            : standardColorNames[layerColor as StandardColorCodes]
        }</gpxx:DisplayColor>`,
      this.indent(baseIndent) + `</gpxx:${featType}Extension>`,
    ];

    return displayColor.join('\n');
  }

  private addTransportationModeExtension(
    activityType: Route['activity_type'],
    baseIndent = 1
  ): string {
    const transportationMode = [
      this.indent(baseIndent) + `<trp:Trip>`,
      this.indent(baseIndent + 1) +
        `<trp:TransportationMode>${
          activityTypeLabels[activityType as ActivityTypes]
        }</trp:TransportationMode>`,
      this.indent(baseIndent) + `</trp:Trip>`,
    ];

    return transportationMode.join('\n');
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
