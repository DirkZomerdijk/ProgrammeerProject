d3.csv("testdata.csv", function(data){

	var dataByName = d3.nest()
  		.key(function(d) { return d.Video; })
  		.entries(data);

  	var complete = {};	
  	dataByName.forEach(function(d, i){
  		complete["video"+i] = d.values
  	})	

  	console.log(complete)

  	
})





