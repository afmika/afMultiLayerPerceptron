/**
 * @author afmika July 2019
 **/
var Neuron = require("./Neuron");
function MLP(config){
    // ex: [4, 3, 3, 2, 1]
    this.n_neuron_per_layers = config.n_neuron_per_layers;
    this.n_layers = config.n_neuron_per_layers.length;
    // x1, x2, ....
    this.n_inputs = config.n_inputs;
    this.trainingdatas = [];
}
MLP.prototype = {
    neurons : [],
    setTrainingdatas : function(datas) {
        // datas [{input : , output :}, .... ]
        var last_index = this.n_neuron_per_layers.length - 1;
        try {
            // output doit etre de taille egale au neurone de sortie
            // ex: 3 neurones de sorties => 3 outputs attendues par rapport aux donnees
            // input entree
            datas.forEach(data=>{
                if(data.output.length != this.n_neuron_per_layers[last_index]) {
                    throw "Error. Number of output != output neuron number.";
                }
                if(data.input.length != this.n_inputs) {
                    throw "Error. Number of number of input ("+data.input.length+") != n_input ("+this.n_inputs+")";
                }
            });

            this.trainingdatas = datas;
        } catch(ex) {
            throw ex;
        }
    },
    getTrainingdatas : function() {
        return this.trainingdatas;
    },
    init : function() {
        for(var i = 0; i < this.n_layers; i++) {
            for(var j = 0; j < this.n_neuron_per_layers[i]; j++) {
                var weights = [];
                var n_input = 0;
                if(i == 0) {
                    //input layer
                    n_input = this.n_inputs;
                } else {
                    n_input = this.n_neuron_per_layers[i-1];
                }
                //console.log(n_input+" tailleXX pour "+i)
                var neuron = new Neuron(n_input);
                neuron.initRandWeights();
                neuron.setInfos({layer_index : i, neuron_index : j});
                this.neurons.push(neuron);
            }
        }
    },
    getLayerAtIndex: function(index) {
        var neurons = [];
        for (let i = 0; i < this.neurons.length; i++) {
            var neuron = this.neurons[i];
            var info = neuron.getInfos();
            if(info.layer_index == index) {
                neurons.push(neuron);
            }
        }
        return neurons;
    },
    getNeuron: function(layer_index, neuron_index) {
        var neuron =  this.getLayerAtIndex(layer_index);
        var found = null;
        neuron.forEach(n => {
           if(n.getInfos().neuron_index == neuron_index) {
               found = n;
               return;
           } 
        });
        if(found == null)
            throw "Index Neuron["+layer_index+"][=>> "+neuron_index+" <<=] is undefined !";
        else
            return found;
    },
    evaluate: function(input_, _debug) {
        // retourne un vecteur du perceptron de sortie
        var out = [];
        for(var i = 0; i < this.n_layers; i++) {
            var tmp_neurons = this.getLayerAtIndex(i);
            var input = null;
            if(i == 0) {
                //input layer
                input = input_;
            } else {
                // output de la couche precedente
                input = out;
            }
            if(i+1 <= this.n_layers) {
                out = [];
            }
            if(_debug) {
                console.log("Layer ", i);
            }
            tmp_neurons.forEach(neuron => {
               neuron.setInput(input);
               var output = neuron.getSigmoidOutput();
               /*if(i+1 == this.n_layers) {
                   // couche de sortie
                    output = neuron.getSigmoidOutput();
               } else {
                   // couche intermediaire
                    output = neuron.getScalarProductOutput();
               }
			   */
               out.push(output);
               if(_debug) {
                    console.log(neuron.getInfos().neuron_index, "=> x ", neuron.input, " w", neuron.weight, " out ", output);
               }
            });
        }
        return out;
    },
    train: function(generation, alpha) {
        var time = 0;
        while(time < generation) {
            var debug = time % 50 == 0 && false;// on peut effacer && false en passant
            if(debug )console.log("GENERATION ", time);

            this.trainingdatas.forEach(data =>{
            // decommenter si on veut piocher les echantillons aleatoirement
            //var randIndex = Math.floor(Math.random() * this.trainingdatas.length);
            //var data = this.trainingdatas[randIndex];
                if(debug)console.log("AUTRE ECHANTILLON", data.input,"<=>", data.output);
                this.evaluate(data.input, debug);
                for(var q = 0; q < this.n_layers; q++) {
                    var currentLayerIndex = this.n_layers - q - 1 ;
                    var layer = this.getLayerAtIndex(currentLayerIndex);
                    var j = 0;
                    layer.forEach(neuron_j => {
                        var delta_j = 0;
                        var yj = neuron_j.getSigmoidOutput();
                        var yi = 0;
                        if(q == 0) {
                            // layer le plus haut
                            var uj = data.output[j];
                            delta_j = (uj - yj ) * yj * (1 - yj);
                        } else {

                            var sum_delta_destination = 0;
                            var destlayer = this.getLayerAtIndex(currentLayerIndex + 1);
                            for(var k = 0; k < destlayer.length; k++){
                                var tmp_neuron = destlayer[k]; // le k ieme neurone
                                // ds = ds + delta(k) * destNeurone(k).weight[j]
                                sum_delta_destination += tmp_neuron.minidelta * tmp_neuron.weight[j];
                            }
                            delta_j = yj * (1 - yj ) * sum_delta_destination;
                        }
                        // permettra de garder son delta pour la couche qui lui precede
                        neuron_j.minidelta = delta_j;
                        var noperation = neuron_j.weight.length;
                        for (let i = 0; i < noperation; i++) {
                            if(q == 0) {
                                // premiere couche
                                neuron_j.weight[i] +=  alpha * delta_j * yj;
                            } else {
                                // couche cachee
                                // c est la connexion entre le neurone actuel j et son precedent-i
                                yi = neuron_j.input[i];
                                neuron_j.weight[i] +=  alpha * delta_j * yi;
                            }
                        }
                        j++;
                    });

                }
            });
            time++;
        }
        console.log("Training done...!");
    }
}

module.exports = MLP;