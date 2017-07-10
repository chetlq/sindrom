'use strict';
var Quiche = require('quiche');

var pie = new Quiche('pie');
pie.setTransparentBackground(); // Make background transparent
pie.addData(3000, 'Foo', 'FF0000');
pie.addData(2900, 'Bas', '0000FF');
pie.addData(500, 'Bar', '00FF00');
pie.setLabel(['Foo','Bas','Bar']); // Add labels to pie segments
var imageUrl = pie.getUrl(true); // First param controls http vs. https
console.log(imageUrl);
