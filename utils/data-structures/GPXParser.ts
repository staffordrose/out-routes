// Uses https://github.com/Luuka/GPXParser.js

type Point = {
  lat: number;
  lon: number;
  ele: number | null;
  time: Date | null;
};

type Waypoint = Point & {
  name: string | null;
  sym: string | null;
  cmt: string | null;
  desc: string | null;
};

type Link = {
  href: string | null;
  text: string | null;
  type: string | null;
};

type Distance = {
  total: number | null;
  cumul: (number | null)[];
};

type Elevation = {
  max: number | null;
  min: number | null;
  pos: number | null;
  neg: number | null;
  avg: number | null;
};

type Track = {
  name: string | null;
  cmt: string | null;
  desc: string | null;
  src: string | null;
  number: string | null;
  type: string | null;
  link: Link;
  distance: Distance;
  elevation: Elevation;
  slopes: number[];
  points: Point[];
};

const keepMetadata = ['name', 'desc', 'time'];

export class GPXParser {
  gpx: string;
  xml: Document;
  metadata: Record<string, string | null> = {
    name: null,
    desc: null,
    time: null,
  };
  waypoints: Waypoint[] = [];
  tracks: Track[] = [];

  constructor(gpx: string) {
    this.gpx = gpx;

    const domParser = new DOMParser();
    this.xml = domParser.parseFromString(gpx, 'text/xml');

    this.parse();
  }

  parse() {
    const metadata = this.xml.querySelector('metadata');

    if (metadata) {
      for (const property of keepMetadata) {
        this.metadata[property] = this.getElementValue(metadata, property);
      }
    }

    this.getWaypoints();

    this.getTracks();

    return {
      metadata: this.metadata,
      waypoints: this.waypoints,
      tracks: this.tracks,
    };
  }

  getWaypoints() {
    const waypoints: Element[] = [].slice.call(
      this.xml.querySelectorAll('wpt')
    );

    for (const index in waypoints) {
      const waypoint = waypoints[index];

      const res = {} as Waypoint;

      res.name = this.getElementValue(waypoint, 'name');
      res.sym = this.getElementValue(waypoint, 'sym');
      res.lat = parseFloat(waypoint.getAttribute('lat') || '');
      res.lon = parseFloat(waypoint.getAttribute('lon') || '');

      const floatValue = parseFloat(
        this.getElementValue(waypoint, 'ele') || ''
      );
      res.ele = isNaN(floatValue) ? null : floatValue;

      res.cmt = this.getElementValue(waypoint, 'cmt');
      res.desc = this.getElementValue(waypoint, 'desc');

      const time = this.getElementValue(waypoint, 'time');
      res.time = time === null ? null : new Date(time);

      this.waypoints.push(res);
    }
  }

  getTracks() {
    const tracks: Element[] = [].slice.call(this.xml.querySelectorAll('trk'));

    for (const index in tracks) {
      let track = tracks[index];
      let res = {} as Track;

      res.name = this.getElementValue(track, 'name');
      res.cmt = this.getElementValue(track, 'cmt');
      res.desc = this.getElementValue(track, 'desc');
      res.src = this.getElementValue(track, 'src');
      res.number = this.getElementValue(track, 'number');

      let type = this.queryDirectSelector(track, 'type');
      res.type = type !== null ? type.innerHTML : null;

      let link = {} as Link;
      let linkEl = track.querySelector('link');

      if (linkEl !== null) {
        link.href = linkEl.getAttribute('href');
        link.text = this.getElementValue(linkEl, 'text');
        link.type = this.getElementValue(linkEl, 'type');
      }
      res.link = link;

      let trackpoints: Point[] = [];
      let trkpts: Element[] = [].slice.call(track.querySelectorAll('trkpt'));

      for (const trkptIndex in trkpts) {
        const trkpt = trkpts[trkptIndex];
        const pt = {} as Point;
        pt.lat = parseFloat(trkpt.getAttribute('lat') || '');
        pt.lon = parseFloat(trkpt.getAttribute('lon') || '');

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

  queryDirectSelector(parent: Element, property: string) {
    const elements = parent.querySelectorAll(property);

    let finalElem = elements[0];

    if (elements.length > 1) {
      const childNodes = parent.childNodes;

      for (const index in childNodes) {
        const el = childNodes[index];
        if (el instanceof Element && el.tagName === property) {
          finalElem = el;
        }
      }
    }

    return finalElem;
  }

  getElementValue(parent: Element, property: string) {
    let elem = parent.querySelector(property);
    if (elem !== null) {
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

        return content;
      };

      return getElementValueRecursive(elem);
    }
    return elem;
  }

  calcDistance(points: Point[]) {
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

  calcDistanceBetween(wpt1: Point, wpt2: Point) {
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

  calcElevation(points: Point[]) {
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

  calcSlope(points: Point[], cumul: Distance['cumul']) {
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
}
