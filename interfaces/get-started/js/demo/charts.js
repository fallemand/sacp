
// Charts.js
// ====================================================================
// This file should not be included in your project.
// This is just a sample how to initialize plugins or components.
//
// - ThemeOn.net -



 $(document).ready(function() {


	// MORRIS AREA CHART
	// =================================================================
	// Require MorrisJS Chart
	// -----------------------------------------------------------------
	// http://morrisjs.github.io/morris.js/
	// =================================================================



	// MORRIS LINE CHART
	// =================================================================
	// Require MorrisJS Chart
	// -----------------------------------------------------------------
	// http://morrisjs.github.io/morris.js/
	// =================================================================
	var day_data = [
		{"elapsed": "I", "value": 34},
		{"elapsed": "II", "value": 24},
		{"elapsed": "III", "value": 3},
		{"elapsed": "IV", "value": 12},
		{"elapsed": "V", "value": 13},
		{"elapsed": "VI", "value": 22},
		{"elapsed": "VII", "value": 5},
		{"elapsed": "VIII", "value": 26},
		{"elapsed": "IX", "value": 12},
		{"elapsed": "X", "value": 19}
	];
	Morris.Line({
		element: 'demo-morris-line',
		data: day_data,
		xkey: 'elapsed',
		ykeys: ['value'],
		labels: ['value'],
		gridEnabled: false,
		gridLineColor: 'transparent',
		lineColors: ['#045d97'],
		lineWidth: 2,
		parseTime: false,
		resize:true,
		hideHover: 'auto'
	});




});
