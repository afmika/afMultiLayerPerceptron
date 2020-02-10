var neuron = null;
var dataToLearn = {
	dataInput : [], // les cellules allumees du canvas
	correctAnswer : [], // selon la nature
	step : 700 // Nombre d apprentissage par defaut
};

function reinitDrawing() {
	// reinitialise le dessin
	listeCasesAllumee = [];

}
function reinitAllData() {
	dataToLearn = {
		dataInput : [], // les cellules allumees du canvas
		correctAnswer : [], // selon la nature
		step : 700 // Nombre d apprentissage par defaut
	};
	neuron = null; // on reinitialise le neurone
	document.getElementById("btn").innerHTML = "Apprendre TOUT!";
	setInfos("Reinitialisation du programme. Ok");
}
function addDataToLearn() {
	var type = prompt("Entrer sa nature (0 ou  1)", 0);
	if(type != 0 && type != 1) {
		alert("Type incorrect! Il faut que ce soit 0 ou 1");
		return;
	}
	
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
	dataToLearn.dataInput.push(data);
	dataToLearn.correctAnswer.push(type);
	reinitDrawing();
	// console.log(data);
	document.getElementById("btn").innerHTML = "Apprendre TOUT! ("+dataToLearn.dataInput.length+") ";
}
function setInfos(str) {
	document.getElementById("infos").innerHTML = str;
}
function learnEverything() {
	if(dataToLearn.dataInput.length < 2 ) {
		alert("Erreur: Enregistrer au moins 2 donnees!");
		return;
	}
	// on cree un neuronne bien entrainee!
	neuron = train(dataToLearn);
	setInfos("Un neuronne est cree!");
	console.log(neuron);
}

function testData() {
	// On peut tester la nature maintenant
	if(neuron == null) {
		alert("Veuillez entrainer un neurone!");
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
	neuron.setInput(input);
	var sortieSigmoid = neuron.getOutputSigmoid();
	var sortieHeaviside = neuron.getOutputHeaviside();
	//console.log(neuron.getWeight());
	setInfos("Reponse sigmoide "+sortieSigmoid + "<br> <br> <span style='font-size: 28px;'>Nature predite : Type "+ sortieHeaviside +"</span>");
}