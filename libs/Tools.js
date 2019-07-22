/**
 * @author afmika July 2019
 **/
function product(u, v) {
    if(u.length != v.length) {
        throw "Different vector length!";
    }
    var s = 0, i;
    for( i = 0; i < u.length; i++) {
        s += u[i] * v[i];
    }
    return s;
}
function roundTo(n, num) {
    // exemple roundTo(2.4598787123, 2) => 2.46
    var p = Math.pow(10, num);
    var n = Math.round(n * p);
    return n / p;
}
function H(s) {
    return s > 0 ? 1 : 0;
}
function sigmoid(s) {
    return 1 / (1 + Math.exp(-s));
}