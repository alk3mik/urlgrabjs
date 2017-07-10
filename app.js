/*
	A Note on PhantomJS (by Nick Santos, author of the NPM package):
	
	"PhantomJS is not a library for NodeJS. It's a separate environment and code written for
	 node is unlikely to be compatible. In particular PhantomJS does not expose a Common JS
	 package loader.
	 phantomjs-prebuilt is an NPM wrapper and can be used to conveniently make Phantom available. It is not
	 a Node JS wrapper. I have had reasonable experiences writing standalone Phantom scripts
	 which I then drive from within a node program by spawning phantom in a child process.
	 Read the PhantomJS FAQ for more details: http://phantomjs.org/faq.html ."
*/

/*
	Below is an example of using this package by implementing the module child_process.
*/

/*
	notorious devices sizes:
	min-width:320px  -> smartphones, iPhone, portrait 480x320 phones
	min-width:481px  -> portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide.
	min-width:641px  -> portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones
	min-width:961px  -> tablet, landscape iPad, lo-res laptops ands desktops
	min-width:1025px -> big landscape tablets, laptops, and desktops
	min-width:1281px -> hi-res laptops and desktops
*/

"use strict";

// Initialisation variables de texte
const urlQuestion 	 = ' >>>>>>>>>> Copiez-collez un URL ci-dessous (ne pas oublier le préfixe "http") <<<<<<<<<<\n\n',
			imgFmtQuestion = "\n >>>>>>>>>> Saisir le format des images de sortie (png ou jpg, png par default) <<<<<<<<<<\n\n",
			zoomQuestion 	 = "\n >>>>>>>>>> Saisir le facteur de zoom (= 1 par default) <<<<<<<<<<\n\n" +
											 "                      ( Réduire       : 0 < valeur < 1)\n" +
											 "                      ( Agrandir      :     valeur > 1)\n" +
											 "                      ( Taille réelle :     valeur = 1)\n",

// Chargement modules et déclaration/initialisation variables
			path 					 = require('path'),
			childProcess 	 = require('child_process'),
			phantomjs 		 = require('phantomjs-prebuilt'),
			readLineSync 	 = require('readline-sync'),
			binPath 			 = phantomjs.path; // *phantomjs-prebuilt* exporte le string *path* qui
																			 // contient le chemin absolu de l'executable phantomjs.

let		childArgs, url, outName, imgFmt, zoom, devices, pageWidth, len, i, j, key;

// Utilise l'UTF-8 comme codage de caractères informatiques du texte d'entrée
process.stdin.setEncoding('utf8');

url = readLineSync.question(urlQuestion);

// On utilise la fonction extractSiteName (voir dessous) pour tirer le nom du site de l'URL
outName = extractSiteName(url);

// Type de format de l'image de sortie (PNG et JPG)
imgFmt = readLineSync.question(imgFmtQuestion);

if (imgFmt !== "png" || imgFmt !== "jpg") {
	imgFmt = "png";
}

// Facteur de zoom (normalement égal à 1)
zoom = readLineSync.question(zoomQuestion);

if (!zoom) {
	zoom = 1;
}

// Message d'attente
console.log("\nCela va prendre quelques seconds...\n");

// Include le fichier JSON (qui contient les tailles des dispositifs)
devices = require("./devices.json");

// Longueur du tableau de dispositifs
len = devices[1].sizes.length;

// Boucle(s) sur toutes les largeurs des dispositifs presents dans devices.json
for (i = 0; i < len; i++) {
    
  for (key in devices[1].sizes[i]) {

    if (devices[1].sizes[i].hasOwnProperty(key)) {

    	for (j = 0; j < 2; j++) {

      	pageWidth = devices[1].sizes[i][key][j];

      	// Tableau contenant le chemin du script et les arguments d'entrée pour PhantomJS
      	childArgs = [path.join(__dirname, '/rasterize.js'), url, outName, imgFmt, zoom, pageWidth, devices[0].units, key];
      
      	// Exécution de phantomJS comme processus enfant
      	childProcess.execFile(binPath, childArgs, (err, stdout, stderr) => {
      		if (err) {
      			console.log("Erreur : " + err);
      		}
      		console.log(stdout);
      	});

    	}

    }

  }

}

/*
	Definition fonction(s) utilisée(s)
*/

// Fonction pour tirer le nom du site web à partir de l'URL
function extractSiteName(url) {
  let websiteName;
  let nameArr;
  let len;

  // Trouve et supprime le protocole (http, ftp, etc) et prend le "websiteName"
  if (url.indexOf("://") > -1) {
      websiteName = url.split('/')[2];
  }
  else {
      websiteName = url.split('/')[0];
  }

  // Trouve et supprime le nombre du port
  websiteName = websiteName.split(':')[0];

  // Trouve et supprime "?"
  websiteName = websiteName.split('?')[0];

  // Supprime le Domaine de premier niveau (Top Level Domain) et
  // le premier label (www, ftp, fr etc.)
  nameArr = websiteName.split('.');
  len = nameArr.length;
  if (len > 1) {
  	websiteName = nameArr[len - 2];
  }
  
  return websiteName;
}