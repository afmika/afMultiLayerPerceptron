/**
 * @author afmika July 2019
 **/

 var MLP = require("./MLP");

//console.log(mlp.getNeuron(0, 1));
function generateRandomDatas(input_length, output_length, numberOfdatas){
    var datas = [];
    for (let i = 0; i < numberOfdatas; i++) {
        // generer l input / output
        var input_gen = [],
            output_gen = [];
        var number_of_one = 0;

        for (let a = 0; a < input_length; a++) {
            var bin = Math.random() > 0.5 ? 1 : 0;
            number_of_one += bin;
            input_gen.push(bin);
        }
        for (let a = 0; a < output_length; a++) {
            // l output doit avoir une logique en fonction de l input
            // sinon ca part en couille!
            // exemple compter le nombre de bit et coder sur l output
            // ex si input 11010 alors output 1110 si output taille 4 et input taille5
            var bin = a < number_of_one ? 1 : 0;
            output_gen.push(bin);
        }
        // ajout de l echantillon
        datas.push({
            input : input_gen,
            output : output_gen
        });      
    }
    return datas;
}
function doTest() {
    // K couches
    //  c. entree(le premier indice), ..., ... , c. sortie 
	// (le dernier indice => doit etre de meme nombre que l output)
    var mlp = new MLP({
        n_neuron_per_layers : [10, 10, 10],
        n_inputs : 4
    });
    var input_length = 4, output_length = 10, numberOfdatas = 100;
    mlp.init();
    mlp.setTrainingdatas(generateRandomDatas(input_length, output_length, numberOfdatas));
    /*
    mlp.setTrainingdatas([
        // entree et ce que l on voudrait avoir
        {input : [1, 0, 0, 1], output : [1, 0, 1]},
        {input : [1, 0, 1, 0], output : [0, 0, 1]},
        {input : [1, 1, 1, 1], output : [1, 1, 1]},
        {input : [0, 0, 0, 1], output : [1, 1, 1]},
        {input : [0, 1, 0, 1], output : [0, 1, 1]},
        {input : [0, 1, 0, 1], output : [0, 1, 1]}
    ]);*/
    var epoques = 500;
    var taux_app = 0.01; // plus c est petit => plus c est precis
    mlp.train(epoques, taux_app);

    var datas = mlp.getTrainingdatas();
    //console.log(datas);
    var pass = datas.length;
    var successfull_pass = datas.length;
    var pourcMin = 0.9; // 90% des signaux sont correctes
    datas.forEach(data => {
        var input = data.input;
        var attendue = data.output;
        var computed = mlp.evaluate(input, false);
        var isOk = true;
        var isTotalyOk = true;
        var bin_pass = attendue.length;
        for(var k = 0; k < attendue.length; k++) {
            var diff = Math.abs(computed[k] - attendue[k]);
            var round = Math.round(diff);
            if(round != 0)  {
                bin_pass--; // les signaux correctes
                if(isTotalyOk){
                    // on change qu une seule fois
                    isTotalyOk = false;
                }
            }
            var r = bin_pass / attendue.length; 
            if(r < pourcMin) {
                isOk = false;
                break;
            }
        }
        if(!isOk) {
            pass--;
        }
        if(!isTotalyOk) {
            successfull_pass--;
        }
        //console.log("Echantillon ",input, " => ", isOk ? "PASS" : ">>FAIL<<");
    });
    console.log("PASS (Precision "+Math.round(100 * pourcMin)+" %) ",pass,"/", datas.length);
    console.log("SUCCESSFULL (Precision 100 %) ",successfull_pass,"/", datas.length);
}
doTest();