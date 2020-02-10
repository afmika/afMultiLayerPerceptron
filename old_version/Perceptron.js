/*
 * Programme dev. par afmika Sept 2017
 * Les fonctions d'activation au choix
 */
function H(x, w) {
    var s = 0;
    for (var i = 0; i < x.length; i++) {
        s += x[i] * w[i];
    }
    return (s > 0) ? 1 : 0;
}
function sigmoid(x, w) {
    var s = 0;
    for (var i = 0; i < x.length; i++) {
        s += x[i] * w[i];
    }
    var sig = 1 / (1 + Math.exp(-s));
    return sig;
}

function Perceptron(dataLength) {
    this.dataLength = dataLength || 0;
}
Perceptron.prototype = {
    connectionList: [],
    getOutputSigmoid: function () {
        return sigmoid(this.input, this.weight);
    },
	getOutputHeaviside: function () {
        return H(this.input, this.weight);
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
    connectTo: function (perc) {
        perc.connectionList.push(this);
    }
}
function train(obj) {
    var rate = 0.8;
    var dataInput = obj.dataInput;
    var correct = obj.correctAnswer;
    var dataLength = dataInput[0].length;
    var w = [];
    for (var i = 0; i < dataLength; i++) {
        w[i] = 0;
    }
    for (var q = 0; q < obj.step; q++) {
        for (var k = 0; k < dataInput.length; k++) {
            var o = sigmoid(dataInput[k], w);
            var c = correct[k];
            var delta = (c - o) * rate;
            for (var n = 0; n < dataLength; n++) {
                /* 
                 * Descente du gradient (retro-propagation du gradient);
                 * Wi <- Wi + (c-o) * Xi*/
                w[n] = w[n] + delta * dataInput[k][n];
            }
        }
    }

    var neuron = new Perceptron();
    /*Un neuronne entrainé apte à la tâche*/
    neuron.setWeight(w);
    return neuron;
}
