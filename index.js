'use strict';

function line(point, length, rotation) {
    var p = new Point(point.x + length, point.y);
    var l = new Path.Line(point, p);
    l.strokeColor = 'black';
    l.rotate(rotation, point);
    return l;
}

function spike(point, length) {
    var p1 = line(point, length, 0);
    var p2 = line(p1.lastSegment.point, length, -60);
    var p3 = line(p2.lastSegment.point, length, 60);
    var p4 = line(p3.lastSegment.point, length, 0);
    return p1.join(p2).join(p3).join(p4);
}

function edge(start, length, depth) {
    var len = length / 3;

    if (depth === 0) {
        return spike(start, len);
    }

    var s1 = edge(start, len, depth - 1);

    var s2 = edge(s1.lastSegment.point, len, depth - 1)
        .rotate(-60, s1.lastSegment.point);

    var s3 = edge(s2.lastSegment.point, len, depth - 1)
        .rotate(60, s2.lastSegment.point);

    var s4 = edge(s3.lastSegment.point, len, depth - 1);

    return s1.join(s2).join(s3).join(s4);
}

function snowflake() {
    var start = new Point(50, 120);
    var length = 360;
    var depth = 4;

    var s1 = edge(start, length, depth);

    var s2 = edge(s1.lastSegment.point, length, depth)
        .rotate(120, s1.lastSegment.point);

    var s3 = edge(s2.lastSegment.point, length, depth)
        .rotate(-120, s2.lastSegment.point);

    var s = s1.join(s2).join(s3);
    s.visible = false;

    return s;
}

var segment = 0;
var points = snowflake();
var animatedSnowflake = new Path();
animatedSnowflake.strokeColor = 'black';

function animate() {
    animatedSnowflake.add(points.segments[segment++].point);

    if (segment === points.segments.length) {
        animatedSnowflake.fillColor = 'blue';

        points.position = new Point(
            animatedSnowflake.position.x + 2,
            animatedSnowflake.position.y + 2
        );
        points.fillColor = 'black';
        points.visible = true;
    }
}

var iter = points.segments.length;
var delay = 0.05;
var skipFirst = false;

function onFrame(event) {
    if (event.count % (60 * delay)) {
        return;
    }
    if (skipFirst) {
        skipFirst = false;
        return;
    }
    if (iter === 0) {
        return;
    } else {
        iter--;
    }

    console.log(delay + " sec passed");

    animate();

    if (iter === 0) {
        console.log('done');
    }
}
