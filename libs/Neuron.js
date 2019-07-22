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
