/*
	PhantomJS input script adapted from http://phantomjs.org/screen-capture.html .
		
    Since PhantomJS is using WebKit, a real layout and rendering engine, it
    can capture a web page as a screenshot.
    Because PhantomJS can render anything on the web page, it can be used to
    convert HTML content styled with CSS but also SVG, images and Canvas elements.
*/

/*
    Jusqu’à 479px : smartphone en portrait
    De 480px à 959px : smartphone en paysage, tablette en portrait et petite tablette en paysage
    De 960px à 1280px : tablette en paysage, écran d’ordinateur de taille petite et moyenne
    1281px et au delà : grand écran d’ordinateur (21" et + en plein écran )
*/

"use strict";

// Chargement modules et définition variables
var page       = require('webpage').create(),
    system     = require('system'),
    url, outName, imgFmt, zoom, pageWidth, units, key, pageHeight;

// Le tableau *system.args*, accessible avec le chargement du module *system*, contient
// les arguments d'entrée passés par l'application principale app.js
url = system.args[1];
outName = system.args[2];
imgFmt = system.args[3];
zoom = system.args[4];
pageWidth = system.args[5];
units = system.args[6];
key = system.args[7];

outName = outName + "_" + key + pageWidth.toString() + units + "." + imgFmt;

// *pageHeight* (hauteur de la page), en n'étant ici qu'un "placeholder" pour page.viewportSize,
// peut prendre n'importe quel valeur
pageHeight = pageWidth*(3/4);

page.viewportSize = { width: pageWidth, height: pageHeight };

page.zoomFactor = zoom;

// On ouvre la page de l'URL
page.open(url, function(status) {

    if (status !== 'success') {

        console.log('Unable to load the address ' + url);
        phantom.exit(1);

    } else {
        
        window.setTimeout(function() {
            page.render(outName);
            console.log('"Screenshot" créé avec succès !');
            phantom.exit();
        }, 200);
    }
});