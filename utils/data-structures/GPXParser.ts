// Uses https://github.com/Luuka/GPXParser.js

import {
  Distance,
  Elevation,
  Link,
  GPXMetadata,
  Point,
  Track,
  Waypoint,
} from '@/types';

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
  waypoints: Waypoint[] = [];
  tracks: Track[] = [];
  error: Error | null = null;

  constructor(gpx: string) {
    this.gpx = gpx;

    const domParser = new DOMParser();
    this.xml = domParser.parseFromString(gpx, 'text/xml');

    this.parse();
  }

  private parse() {
    const gpxEl = this.xml.querySelector('gpx');
    const version = gpxEl?.getAttribute('version');

    if (version !== '1.1') {
      this.error = new Error('Only GPX version 1.1 can be imported');
    }

    this.getMetadata();
    this.getWaypoints();
    this.getTracks();
  }

  private getMetadata() {
    const metadata = this.xml.querySelector('metadata');

    if (metadata) {
      // name
      this.metadata.name = this.getElementValue(metadata, 'name');
      // description
      this.metadata.desc = this.getElementValue(metadata, 'desc');
      // author
      const authorEl = metadata.querySelector('author');
      if (authorEl) {
        const emailEl = authorEl.querySelector('email');
        const linkEl = authorEl.querySelector('link');
        this.metadata.author = {
          name: this.getElementValue(authorEl, 'name') || '',
          email: emailEl
            ? {
                id: emailEl.getAttribute('id') || '',
                domain: emailEl.getAttribute('domain') || '',
              }
            : null,
          link: linkEl
            ? {
                href: linkEl.getAttribute('href') || '',
                text: this.getElementValue(linkEl, 'text') || '',
                type: this.getElementValue(linkEl, 'type') || null,
              }
            : null,
        };
      }
      // copyright
      const copyrightEl = metadata.querySelector('copyright');
      if (copyrightEl) {
        this.metadata.copyright = {
          author: copyrightEl.getAttribute('author') || '',
          year: parseInt(this.getElementValue(copyrightEl, 'year') || ''),
          license: this.getElementValue(copyrightEl, 'license'),
        };
      }
      // link
      const linkEl = metadata.querySelector('link');
      if (linkEl) {
        this.metadata.link = {
          href: linkEl.getAttribute('href') || '',
          text: this.getElementValue(linkEl, 'text') || '',
          type: this.getElementValue(linkEl, 'type') || null,
        };
      }
      // time
      const timeStr = this.getElementValue(metadata, 'time');
      this.metadata.time = !timeStr ? null : new Date(timeStr);
      // keywords
      const keywordsStr = this.getElementValue(metadata, 'keywords');
      const keywordsArr = keywordsStr ? keywordsStr.split(', ') : [];
      this.metadata.keywords =
        Array.isArray(keywordsArr) && keywordsArr.length ? keywordsArr : null;
      // bounds
      const boundsEl = metadata.querySelector('bounds');
      if (boundsEl) {
        this.metadata.bounds = [
          [
            parseFloat(boundsEl.getAttribute('minlon') || ''),
            parseFloat(boundsEl.getAttribute('minlat') || ''),
          ],
          [
            parseFloat(boundsEl.getAttribute('maxlon') || ''),
            parseFloat(boundsEl.getAttribute('maxlat') || ''),
          ],
        ];
      }
    }
  }

  private getWaypoints() {
    const waypoints: Element[] = [].slice.call(
      this.xml.querySelectorAll('wpt')
    );

    for (const index in waypoints) {
      const waypoint = waypoints[index];

      const res = {} as Waypoint;

      /**
       * waypoint attributes
       */

      // latitude
      res.lat = parseFloat(waypoint.getAttribute('lat') || '');
      // longitude
      res.lon = parseFloat(waypoint.getAttribute('lon') || '');

      /**
       * waypoint values
       */

      // name
      res.name = this.getElementValue(waypoint, 'name');
      // elevation
      const eleFloat = parseFloat(this.getElementValue(waypoint, 'ele') || '');
      res.ele = isNaN(eleFloat) ? null : eleFloat;
      // symbol
      res.sym = this.getElementValue(waypoint, 'sym');
      // comment
      res.cmt = this.getElementValue(waypoint, 'cmt');
      // description
      res.desc = this.getElementValue(waypoint, 'desc');
      // time
      const timeStr = this.getElementValue(waypoint, 'time');
      res.time = timeStr === null ? null : new Date(timeStr);

      this.waypoints.push(res);
    }
  }

  private getTracks() {
    const tracks: Element[] = [].slice.call(this.xml.querySelectorAll('trk'));

    for (const index in tracks) {
      const track = tracks[index];

      const res = {} as Track;

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
      const type = this.queryDirectSelector(track, 'type');
      res.type = type?.innerHTML ? this.trimCDATA(type.innerHTML) : null;
      // link
      let link = {} as Link;
      let linkEl = track.querySelector('link');
      if (linkEl) {
        // link attributes
        link.href = linkEl.getAttribute('href') || '';
        // link values
        link.text = this.getElementValue(linkEl, 'text') || '';
        link.type = this.getElementValue(linkEl, 'type');
      }
      res.link = link;
      // trackpoints
      let trackpoints: Point[] = [];
      let trkpts: Element[] = [].slice.call(track.querySelectorAll('trkpt'));
      for (const trkptIndex in trkpts) {
        const trkpt = trkpts[trkptIndex];
        const pt = {} as Point;

        // trackpoint attributes
        pt.lat = parseFloat(trkpt.getAttribute('lat') || '');
        pt.lon = parseFloat(trkpt.getAttribute('lon') || '');

        // trackpoint values
        let floatValue = parseFloat(this.getElementValue(trkpt, 'ele') || '');
        pt.ele = isNaN(floatValue) ? null : floatValue;
        let time = this.getElementValue(trkpt, 'time');
        pt.time = time === null ? null : new Date(time);

        trackpoints.push(pt);
      }
      res.distance = this.calcDistance(trackpoints);
      res.elevation = this.calcElevation(trackpoints);
      res.slopes = this.calcSlope(trackpoints, res.distance.cumul);
      res.points = trackpoints;

      this.tracks.push(res);
    }
  }

  private queryDirectSelector(parent: Element, property: string) {
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

  private getElementValue(parent: Element, property: string) {
    let el = parent.querySelector(property);

    if (el) {
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

    return el;
  }

  private calcDistance(points: Point[]) {
    const res = {} as Distance;

    let totalDistance: Distance['total'] = 0;
    let cumulDistance: Distance['cumul'] = [];

    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += this.calcDistanceBetween(points[i], points[i + 1]);
      cumulDistance[i] = totalDistance;
    }
    cumulDistance[points.length - 1] = totalDistance;

    res.total = totalDistance;
    res.cumul = cumulDistance;

    return res;
  }

  private calcDistanceBetween(wpt1: Point, wpt2: Point) {
    const latlng1 = {} as Point;
    latlng1.lat = wpt1.lat;
    latlng1.lon = wpt1.lon;

    const latlng2 = {} as Point;
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

  private calcElevation(points: Point[]) {
    const res = {} as Elevation;

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

  private calcSlope(points: Point[], cumul: Distance['cumul']) {
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
