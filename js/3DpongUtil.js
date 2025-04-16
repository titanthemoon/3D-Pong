Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Color must be string in format AABBCC
function linColorInterp(c1, c2, l) {
    let [r1, g1, b1] = colorToArray(parseInt(c1, 16));
    let [r2, g2, b2] = colorToArray(parseInt(c2, 16));

    let oR = Math.floor(l * (r2 - r1) + r1);
    let oG = Math.floor(l * (g2 - g1) + g1);
    let oB = Math.floor(l * (b2 - b1) + b1);

    return Number((oR << 16) + (oG << 8) + oB).toString(16);


}

function colorToArray(color) {
    let r = color >> 16;
    let g = (color >> 8) % 256;
    let b = color % 256;
  
    return [r, g, b];
}