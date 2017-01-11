var dataset

d3.csv('data/data.csv', function(error, data) {
	if (error) throw error;
	dataset = data
})


d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	document.body.appendChild(xml.documentElement);
})

