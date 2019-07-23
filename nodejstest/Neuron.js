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

// Neuron class
function Neuron(dataLength) {
    this.dataLength = dataLength || 0;
    this.weight = [];
    this.input = [];
    this.infos = {};
}
Neuron.prototype = {
    setInfos : function(info) {
        this.infos = info;
    },
    getInfos : function(){
        return this.infos;
    },
    initWeights: function() {
        for(var i = 0; i < this.dataLength; i++) {
            this.weight.push(0);
        }
    },
    initRandWeights: function() {
        for(var i = 0; i < this.dataLength; i++) {
            this.weight.push(roundTo(Math.random(), 2));
        }
    },
    setInput: function (x) {
        this.input = x;
        this.dataLength = x.length;
    },
    setWeight: function (w) {
        this.weight = w;
        this.dataLength = w.length;
    },
    getWeight: function () {
        return this.weight;
    },
    getInput: function () {
        return this.input;
    },
    getScalarProductOutput: function() {
        return product(this.weight, this.input);
    },
    getSigmoidOutput: function() {
        return sigmoid(this.getScalarProductOutput());
    }
}
module.exports = Neuron;