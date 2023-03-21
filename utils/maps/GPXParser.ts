// Uses https://github.com/Luuka/GPXParser.js

import {
  GPXAuthor,
  GPXCopyright,
  GPXDistance,
  GPXElevation,
  GPXMetadata,
  GPXLink,
  LngLat,
  GPXPoint,
  GPXRoute,
  GPXTrack,
  GPXWaypoint,
  GPXFeature,
  GPXFeatures,
} from '@/types/maps';

export class GPXParser {
  gpx: string;
  xml: Document;
  metadata: GPXMetadata = {
    name: null,
    desc: null,
    author: null,
    copyright: null,
    link: null,
    time: null,
    keywords: null,
    bounds: null,
  };
  sections: string[] = [];
  features: GPXFeature[] = [];
  waypoints: GPXWaypoint[] = [];
  routes: GPXRoute[] = [];
  tracks: GPXTrack[] = [];
  error: Error | null = null;

  constructor(gpx: string) {
    this.gpx = gpx;

    const domParser = new DOMParser();
    this.xml = domParser.parseFromString(gpx, 'text/xml');

    this.parse();
  }

  private parse(): void {
    const gpxEl = this.xml.querySelector('gpx');
    const version = gpxEl ? this.getAttribute(gpxEl, 'version') : null;

    if (version !== '1.1') {
      this.error = new Error('Only GPX version 1.1 can be imported');
    }

    this.getMetadata();

    const elements: Element[] = [].slice.call(
      this.xml.querySelectorAll(
        `${GPXFeatures.WPT}, ${GPXFeatures.RTE}, ${GPXFeatures.TRK}`
      )
    );

    for (const index in elements) {
      const el = elements[index];

      if (el.tagName === GPXFeatures.WPT) {
        this.getWaypoint(el);
      } else if (el.tagName === GPXFeatures.RTE) {
        this.getRoute(el);
      } else if (el.tagName === GPXFeatures.TRK) {
        this.getTrack(el);
      }
    }
  }

  private getMetadata(): void {
    const metadata = this.xml.querySelector('metadata');

    if (metadata) {
      // name
      this.metadata.name = this.getElementValue(metadata, 'name');
      // description
      this.metadata.desc = this.getElementValue(metadata, 'desc');
      // author
      this.metadata.author = this.getAuthor(metadata);
      // copyright
      this.metadata.copyright = this.getCopyright(metadata);
      // link
      this.metadata.link = this.getLinkValue(metadata);
      // time
      this.metadata.time = this.getTimeValue(metadata);
      // keywords
      this.metadata.keywords = this.getKeywords(metadata);
      // bounds
      this.metadata.bounds = this.getBounds(metadata);
    }
  }

  private getAuthor(metadata: Element): GPXAuthor | null {
    const authorEl = metadata.querySelector('author');

    if (!authorEl) return null;

    const author = {} as GPXAuthor;

    // name
    author.name = this.getElementValue(authorEl, 'name') || '';
    // email
    const emailEl = authorEl.querySelector('email');
    author.email = emailEl
      ? {
          id: this.getAttribute(emailEl, 'id') || '',
          domain: this.getAttribute(emailEl, 'domain') || '',
        }
      : null;
    // link
    author.link = this.getLinkValue(authorEl);

    return author;
  }

  private getCopyright(metadata: Element): GPXCopyright | null {
    const copyrightEl = metadata.querySelector('copyright');

    if (!copyrightEl) return null;

    const copyright = {} as GPXCopyright;

    // author
    copyright.author = this.getAttribute(copyrightEl, 'author') || '';
    // year
    copyright.year = this.getElementIntValue(copyrightEl, 'year');
    // license
    copyright.license = this.getElementValue(copyrightEl, 'license');

    return copyright;
  }

  private getKeywords(metadata: Element): string[] | null {
    const str = this.getElementValue(metadata, 'keywords');
    const arr = str ? str.split(', ') : [];

    return !Array.isArray(arr) || !arr.length ? null : arr;
  }

  private getBounds(metadata: Element): LngLat[] | null {
    const boundsEl = metadata.querySelector('bounds');

    if (!boundsEl) return null;

    return [
      [
        this.getFloatAttribute(boundsEl, 'minlon'),
        this.getFloatAttribute(boundsEl, 'minlat'),
      ],
      [
        this.getFloatAttribute(boundsEl, 'maxlon'),
        this.getFloatAttribute(boundsEl, 'maxlat'),
      ],
    ];
  }

  private getWaypoint(waypoint: Element): void {
    const res = {} as GPXWaypoint;

    /**
     * waypoint attributes
     */

    // latitude
    res.lat = this.getFloatAttribute(waypoint, 'lat');
    // longitude
    res.lon = this.getFloatAttribute(waypoint, 'lon');

    /**
     * waypoint values
     */

    // name
    res.name = this.getElementValue(waypoint, 'name');
    // elevation
    res.ele = this.getElementFloatValue(waypoint, 'ele');
    // symbol
    res.sym = this.getElementValue(waypoint, 'sym');
    // comment
    res.cmt = this.getElementValue(waypoint, 'cmt');
    // description
    res.desc = this.getElementValue(waypoint, 'desc');
    // time
    res.time = this.getTimeValue(waypoint);
    // extensions
    const extensionsEl = waypoint.querySelector('extensions');
    if (extensionsEl) {
      // section
      const [gpxoutEl] = this.getXmlElementByTagName(
        extensionsEl,
        'gpxout',
        'WaypointExtension'
      );
      if (gpxoutEl) {
        res.section = this.getXmlElementValue(gpxoutEl, 'gpxout', 'Section');
      }
      // display color
      const [gpxxEl] = this.getXmlElementByTagName(
        extensionsEl,
        'gpxx',
        'WaypointExtension'
      );
      if (gpxxEl) {
        res.displayColor = this.getXmlElementValue(
          gpxxEl,
          'gpxx',
          'DisplayColor'
        );
      }
    }

    if (res.section && !this.sections.includes(res.section)) {
      this.sections.push(res.section);
    } else if (!res.section && !this.sections.includes('')) {
      this.sections.push('');
    }

    this.features.push({ type: GPXFeatures.WPT, feature: res });
    this.waypoints.push(res);
  }

  private getRoute(route: Element): void {
    const res = {} as GPXRoute;

    /**
     * route values
     */

    // name
    res.name = this.getElementValue(route, 'name');
    // comment
    res.cmt = this.getElementValue(route, 'cmt');
    // description
    res.desc = this.getElementValue(route, 'desc');
    // source
    res.src = this.getElementValue(route, 'src');
    // number
    res.number = this.getElementValue(route, 'number');
    // type
    res.type = this.getTypeValue(route);
    // link
    res.link = this.getLinkValue(route);
    // routepoints
    const routepoints = [];
    const rtepts: Element[] = [].slice.call(route.querySelectorAll('rtept'));
    for (const rteptIndex in rtepts) {
      const rtept = rtepts[rteptIndex];
      const pt = {} as GPXPoint;

      /**
       * routepoint attributes
       */

      // latitude
      pt.lat = this.getFloatAttribute(rtept, 'lat');
      // longitude
      pt.lon = this.getFloatAttribute(rtept, 'lon');

      /**
       * routepoint values
       */

      // elevation
      pt.ele = this.getElementFloatValue(rtept, 'ele');
      // time
      pt.time = this.getTimeValue(rtept);

      routepoints.push(pt);
    }
    // distance
    res.distance = this.calcDistance(routepoints);
    // elevation
    res.elevation = this.calcElevation(routepoints);
    // slopes
    res.slopes = this.calcSlope(routepoints, res.distance.cumul);
    // points
    res.points = routepoints;
    // extensions
    const extensionsEl = route.querySelector('extensions');
    if (extensionsEl) {
      // section
      const [gpxoutEl] = this.getXmlElementByTagName(
        extensionsEl,
        'gpxout',
        'RouteExtension'
      );
      if (gpxoutEl) {
        res.section = this.getXmlElementValue(gpxoutEl, 'gpxout', 'Section');
      }
      // display color
      const [gpxxEl] = this.getXmlElementByTagName(
        extensionsEl,
        'gpxx',
        'RouteExtension'
      );
      if (gpxxEl) {
        res.displayColor = this.getXmlElementValue(
          gpxxEl,
          'gpxx',
          'DisplayColor'
        );
      }
      // transportation mode
      const [trpEl] = this.getXmlElementByTagName(extensionsEl, 'trp', 'Trip');
      if (trpEl) {
        res.transportationMode = this.getXmlElementValue(
          trpEl,
          'trp',
          'TransportationMode'
        );
      }
    }

    if (res.section && !this.sections.includes(res.section)) {
      this.sections.push(res.section);
    } else if (!res.section && !this.sections.includes('')) {
      this.sections.push('');
    }

    this.features.push({ type: GPXFeatures.RTE, feature: res });
    this.routes.push(res);
  }

  private getTrack(track: Element): void {
    const res = {} as GPXTrack;

    /**
     * track values
     */

    // name
    res.name = this.getElementValue(track, 'name');
    // comment
    res.cmt = this.getElementValue(track, 'cmt');
    // description
    res.desc = this.getElementValue(track, 'desc');
    // source
    res.src = this.getElementValue(track, 'src');
    // number
    res.number = this.getElementValue(track, 'number');
    // type
    res.type = this.getTypeValue(track);
    // link
    res.link = this.getLinkValue(track);
    // trackpoints
    const trackpoints: GPXPoint[] = [];
    const trkpts: Element[] = [].slice.call(track.querySelectorAll('trkpt'));
    for (const trkptIndex in trkpts) {
      const trkpt = trkpts[trkptIndex];
      const pt = {} as GPXPoint;

      /**
       * trackpoint attributes
       */

      // latitude
      pt.lat = this.getFloatAttribute(trkpt, 'lat');
      // longitude
      pt.lon = this.getFloatAttribute(trkpt, 'lon');

      /**
       * trackpoint values
       */

      // elevation
      pt.ele = this.getElementFloatValue(trkpt, 'ele');
      // time
      pt.time = this.getTimeValue(trkpt);

      trackpoints.push(pt);
    }
    // distance
    res.distance = this.calcDistance(trackpoints);
    // elevation
    res.elevation = this.calcElevation(trackpoints);
    // slopes
    res.slopes = this.calcSlope(trackpoints, res.distance.cumul);
    // points
    res.points = trackpoints;
    // extensions
    const extensionsEl = track.querySelector('extensions');
    if (extensionsEl) {
      // section
      const [gpxoutEl] = this.getXmlElementByTagName(
        extensionsEl,
        'gpxout',
        'TrackExtension'
      );
      if (gpxoutEl) {
        res.section = this.getXmlElementValue(gpxoutEl, 'gpxout', 'Section');
      }
      // display color
      const [gpxxEl] = this.getXmlElementByTagName(
        extensionsEl,
        'gpxx',
        'TrackExtension'
      );
      if (gpxxEl) {
        res.displayColor = this.getXmlElementValue(
          gpxxEl,
          'gpxx',
          'DisplayColor'
        );
      }
      // transportation mode
      const [trpEl] = this.getXmlElementByTagName(extensionsEl, 'trp', 'Trip');
      if (trpEl) {
        res.transportationMode = this.getXmlElementValue(
          trpEl,
          'trp',
          'TransportationMode'
        );
      }
    }

    if (res.section && !this.sections.includes(res.section)) {
      this.sections.push(res.section);
    } else if (!res.section && !this.sections.includes('')) {
      this.sections.push('');
    }

    this.features.push({ type: GPXFeatures.TRK, feature: res });
    this.tracks.push(res);
  }

  private getAttribute(node: Element, attribute: string): string | null {
    return node.getAttribute(attribute) || null;
  }

  private getFloatAttribute(node: Element, attribute: string): number {
    return parseFloat(this.getAttribute(node, attribute) || '0');
  }

  private getElementValue(parent: Element, property: string): string | null {
    const el = parent.querySelector(property);

    if (!el) return null;

    const getElementValueRecursive = (el: Element) => {
      let content: string = '';

      if (el.innerHTML !== undefined) {
        content = el.innerHTML;
      } else {
        const childNodeArr = Array.from(el.childNodes);

        for (const childNode of childNodeArr) {
          if (childNode instanceof Element) {
            const result = getElementValueRecursive(childNode);
            if (result) {
              content = result;
              break;
            }
          }
        }
      }

      content = this.trimCDATA(content);

      return content;
    };

    return getElementValueRecursive(el);
  }

  private getXmlElementByTagName(
    el: Element | null,
    ns: 'gpxout' | 'gpxx' | 'trp',
    prefix: string
  ): Element[] {
    return [].slice.call(
      el?.getElementsByTagName(`${ns}:${prefix}`) ||
        el?.getElementsByTagName(prefix) ||
        []
    );
  }

  private getXmlElementValue(
    parent: Element,
    ns: 'gpxout' | 'gpxx' | 'trp',
    prefix: string
  ): string | null {
    const [el] = this.getXmlElementByTagName(parent, ns, prefix);

    if (!el) return null;

    const getElementValueRecursive = (el: Element) => {
      let content: string = '';

      if (el.innerHTML !== undefined) {
        content = el.innerHTML;
      } else {
        const childNodeArr = Array.from(el.childNodes);

        for (const childNode of childNodeArr) {
          if (childNode instanceof Element) {
            const result = getElementValueRecursive(childNode);
            if (result) {
              content = result;
              break;
            }
          }
        }
      }

      content = this.trimCDATA(content);

      return content;
    };

    return getElementValueRecursive(el);
  }

  private getElementFloatValue(
    parent: Element,
    property: string
  ): number | null {
    const float = parseFloat(this.getElementValue(parent, property) || '');

    return Number.isNaN(float) ? null : float;
  }

  private getElementIntValue(parent: Element, property: string): number | null {
    const int = parseInt(this.getElementValue(parent, property) || '');

    return Number.isNaN(int) ? null : int;
  }

  private getLinkValue(parent: Element): GPXLink | null {
    const linkEl = parent.querySelector('link');

    if (!linkEl) return null;

    const link = {} as GPXLink;

    /**
     * link attributes
     */

    // href
    link.href = linkEl.getAttribute('href') || '';

    /**
     * link values
     */

    // text
    link.text = this.getElementValue(linkEl, 'text') || '';
    // type
    link.type = this.getElementValue(linkEl, 'type');

    return link;
  }

  private getTimeValue(parent: Element): Date | null {
    const time = this.getElementValue(parent, 'time');

    return time !== null ? new Date(time) : null;
  }

  private queryDirectSelector(
    parent: Element,
    property: string
  ): Element | null {
    const elements = parent.querySelectorAll(property);

    let finalEl = elements[0];

    if (elements.length > 1) {
      const childNodes = parent.childNodes;

      for (const index in childNodes) {
        const el = childNodes[index];
        if (el instanceof Element && el.tagName === property) {
          finalEl = el;
        }
      }
    }

    return finalEl;
  }

  private getTypeValue(parent: Element): string | null {
    const type = this.queryDirectSelector(parent, 'type');

    return type?.innerHTML ? this.trimCDATA(type.innerHTML) : null;
  }

  private calcDistance(points: GPXPoint[]): GPXDistance {
    const res = {} as GPXDistance;

    let totalDistance: GPXDistance['total'] = 0;
    const cumulDistance: GPXDistance['cumul'] = [];

    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += this.calcDistanceBetween(points[i], points[i + 1]);
      cumulDistance[i] = totalDistance;
    }
    cumulDistance[points.length - 1] = totalDistance;

    res.total = totalDistance;
    res.cumul = cumulDistance;

    return res;
  }

  private calcDistanceBetween(wpt1: GPXPoint, wpt2: GPXPoint): number {
    const latlng1 = {} as GPXPoint;
    latlng1.lat = wpt1.lat;
    latlng1.lon = wpt1.lon;

    const latlng2 = {} as GPXPoint;
    latlng2.lat = wpt2.lat;
    latlng2.lon = wpt2.lon;

    const rad = Math.PI / 180;
    const lat1 = latlng1.lat * rad;
    const lat2 = latlng2.lat * rad;
    const sinDLat = Math.sin(((latlng2.lat - latlng1.lat) * rad) / 2);
    const sinDLon = Math.sin(((latlng2.lon - latlng1.lon) * rad) / 2);
    const a =
      sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 6371000 * c;
  }

  private calcElevation(points: GPXPoint[]): GPXElevation {
    const res = {} as GPXElevation;

    let dp = 0;
    let dm = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const rawNextElevation = points[i + 1].ele;
      const rawElevation = points[i].ele;

      if (rawNextElevation !== null && rawElevation !== null) {
        const diff =
          parseFloat(rawNextElevation.toString()) -
          parseFloat(rawElevation.toString());

        if (diff < 0) {
          dm += diff;
        } else if (diff > 0) {
          dp += diff;
        }
      }
    }

    const elevation: number[] = [];
    let sum = 0;

    for (let i = 0; i < points.length; i++) {
      const rawElevation = points[i].ele;

      if (rawElevation !== null) {
        const ele = parseFloat(rawElevation.toString());
        elevation.push(ele);
        sum += ele;
      }
    }

    res.max = Math.max.apply(null, elevation) || null;
    res.min = Math.min.apply(null, elevation) || null;
    res.pos = Math.abs(dp) || null;
    res.neg = Math.abs(dm) || null;
    res.avg = sum / elevation.length || null;

    return res;
  }

  private calcSlope(points: GPXPoint[], cumul: GPXDistance['cumul']): number[] {
    const res: number[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      const elevationDiff = (nextPoint.ele || 0) - (point.ele || 0);
      const distance = (cumul[i + 1] || 0) - (cumul[i] || 0);

      const slope = (elevationDiff * 100) / distance;
      res.push(slope);
    }

    return res;
  }

  private trimCDATA(str: string): string {
    if (str.startsWith('<![CDATA[') && str.endsWith(']]>')) {
      return str.slice(9, -3);
    }

    return str;
  }
}
