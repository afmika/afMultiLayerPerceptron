var canvas = document.getElementById("canvas");
var ctx =  canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var point = []; // contient les points des lignes
var listeCasesAllumee = []; // liste des cases allumees
var draw = false;
var dernier = null;
var cursorPosition = {x : -1, y : -1};
var couleurLigne = "violet";
var couleurCaseAllumee = "yellowgreen";
var couleurDamier = "aliceblue";
var couleurSurvole = "red";
var divisionCellule = 10; // un damier  16 x 16
// on dessine les cellules

var tailleCelluleWidth = canvas.width / divisionCellule;
var tailleCelluleHeight = canvas.height / divisionCellule;

function relier(a, b) {
	ctx.beginPath();
	ctx.strokeStyle = couleurLigne;
	ctx.lineWidth = 1;
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.stroke();
	ctx.closePath();
}

function drawPoint() {
	for(var i=0; i < point.length-1; i++) {
		//ctx.fillStyle = "red";
		//ctx.fillRect(point[i].x, point[i].y, 5, 5); //debogage
		relier(point[i], point[i+1]);
	}
}

function newPoint(e) {
	//ctx.clearRect(0,0, width, height);
	var x = e.clientX-canvas.offsetLeft;
	var y = e.clientY-canvas.offsetTop;
	dernier = {x:x, y:y};
	point.push(dernier);
	
	var caseTouchee = {
		x : Math.floor(x / tailleCelluleWidth),
		y : Math.floor(y / tailleCelluleHeight)
	};
	
	listeCasesAllumee.push(caseTouchee);
	drawPoint();
}

function init() {
	draw = false;
	point = [];
}

function drawCases() {
	for(var i=0; i < listeCasesAllumee.length; i++) {
		var p = listeCasesAllumee[i];
		ctx.fillStyle = couleurCaseAllumee;
		ctx.lineWidth = 3;
		ctx.fillRect(p.x * tailleCelluleWidth, p.y * tailleCelluleHeight, tailleCelluleWidth, tailleCelluleHeight);
	}
	for(var i=0; i < divisionCellule; i++) {
		for(var j=0; j < divisionCellule; j++) {
			ctx.strokeStyle = couleurDamier;
			ctx.strokeRect(j * tailleCelluleWidth, i * tailleCelluleHeight, tailleCelluleWidth, tailleCelluleHeight);
		}		
	}
	
	var tmp = cursorPosition;
	ctx.strokeStyle = couleurSurvole;
	ctx.lineWidth = 1.5;
	ctx.strokeRect(tmp.x * tailleCelluleWidth, tmp.y * tailleCelluleHeight, tailleCelluleWidth, tailleCelluleHeight);
}

setInterval( function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCases();
}, 1000 / 24);

canvas.addEventListener("mousedown", function(e) {
	draw = true;
	newPoint(e);
});

canvas.addEventListener("mousemove", function(e) {
	var x = e.clientX-canvas.offsetLeft;
	var y = e.clientY-canvas.offsetTop;
	cursorPosition = {
		x : Math.floor(x / tailleCelluleWidth), 
		y : Math.floor(y / tailleCelluleHeight)
	};
	if(draw) 
		newPoint(e);
});

canvas.addEventListener("mouseup", function(e) {
	init();
});

document.addEventListener("keydown", function(e) {
	if(e.keyCode == 32) { //espace
		draw = true;
	}
});

document.addEventListener("keyup", function(e) {init();});
