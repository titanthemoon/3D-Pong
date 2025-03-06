Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}