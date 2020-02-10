var mlp = null;
var n_output = eval(prompt("Dimension de la sortie ", 4));
var dataToLearn = null;

function reinitDrawing() {
	// reinitialise le dessin
	listeCasesAllumee = [];
}
function reinitAllData() {
	dataToLearn = {
		data_vector : [],
		step : 100, // Nombre d apprentissage par defaut
		n_output : n_output,
		learning_rate : 0.01,
		layers : [40, 20, n_output] // structure du reseaux
	};
	mlp = null; // on reinitialise le mlp 
	var hiddenlayers = [], u = 0;
	dataToLearn.layers.forEach(layer => {
		if(u + 1 < dataToLearn.layers.length) {
			hiddenlayers.push(layer);
		}
		u++;
	});

	document.getElementById("structure").value = hiddenlayers.join(",");
	document.getElementById("lastlayer").innerHTML = dataToLearn.n_output;
	document.getElementById("generation").value = dataToLearn.step;
	document.getElementById("learning_rate").value = dataToLearn.learning_rate;
	document.getElementById("btn").innerHTML = "Apprendre TOUT!";
	setInfos("Reinitialisation du programme. Ok");
}
function readUserInputConfig() {
	var structure = document.getElementById("structure").value;
	var struct = structure.split(",");
	for(var i=0; i < struct.length; i++) {
		struct[i] = eval(struct[i]);
	}
	struct.push(n_output); // la derniere couche
	dataToLearn.layers = struct;
	dataToLearn.step = eval(document.getElementById("generation").value);
	dataToLearn.learning_rate = eval(document.getElementById("learning_rate").value);
	console.log(dataToLearn);
}


function addDataToLearn() {
	var type = prompt("Entrer sa nature (succession de 1 et 0 au nombre de "+dataToLearn.n_output+" !)", "0000");
	var new_output = []; // version tableau numerique
	for(var q = 0; q < type.length; q++) {
		if((type[q] != 0 && type[q] != 1) || type.length != dataToLearn.n_output) {
			alert("Caracteres incorrectes ou nombre de bits differents de "+dataToLearn.n_output);
			return;
		} else {
			// on construit le tableau de bit correspondant
			new_output.push(eval(type[q]));
		}
	}
	// on transforme type en nombre
	var data = []; // on chaine les donnees mais on stocke pas la matrice
	for(var i=0; i < divisionCellule; i++) {
		for(var j=0; j < divisionCellule; j++) {
			var find = false;
			for(var t=0; t < listeCasesAllumee.length; t++) {
				var p = listeCasesAllumee[t];
				if(p.x == j && p.y == i) {
					find = true;
					break;
				}
			}
			data.push(find ? 1 : 0);
		}
	}
	// on configure un nouvel echantillon
	dataToLearn.data_vector.push({
		input : data,
		output : new_output
	});
	// console.log(data);
	
	reinitDrawing();
	document.getElementById("btn").innerHTML = "Apprendre TOUT! ("+dataToLearn.data_vector.length+") ";
}
function setInfos(str) {
	document.getElementById("infos").innerHTML = str;
}
function learnEverything() {
	if(dataToLearn.data_vector.length < 2 ) {
		alert("Erreur: Enregistrer au moins 2 donnees!");
		return;
	}
	// on cree un mlp e bien entrainee!
	mlp = new MLP({
        n_neuron_per_layers : dataToLearn.layers,
        n_inputs : dataToLearn.data_vector[0].input.length
	});

	readUserInputConfig();
	setInfos("Creation en cours...");
	var epoques = dataToLearn.step;
	var taux_app = dataToLearn.learning_rate; // plus c est petit => plus c est precis

	mlp.init();
    mlp.setTrainingdatas(dataToLearn.data_vector);
    mlp.train(epoques, taux_app);

	setInfos("Un reseau de neurones est cree!");
	console.log(mlp);
}

function testData() {
	// On peut tester la nature maintenant
	if(mlp == null) {
		alert("Veuillez entrainer un mlp !");
		return;
	}
	var input = []; // on chaine les donnees mais on stocke pas la matrice
	for(var i=0; i < divisionCellule; i++) {
		for(var j=0; j < divisionCellule; j++) {
			var find = false;
			for(var t=0; t < listeCasesAllumee.length; t++) {
				var p = listeCasesAllumee[t];
				if(p.x == j && p.y == i) {
					find = true;
					break;
				}
			}
			input.push(find ? 1 : 0);
		}
	}

	var result = mlp.evaluate(input);
	console.log(result);
	var arrondi = [];
	var k = 0;
	result.forEach(q =>{
		arrondi.push(Math.round(q));
		result[k] = roundTo(q, 3);
		k++;
	});
	//console.log(mlp getWeight());
	setInfos("Reponse sigmoide "+result.join(",") + "<br> <br> <span style='font-size: 28px;'>Nature predite : Type "+ arrondi.join(",") +"</span>");
}
reinitAllData();