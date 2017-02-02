#Design Document
## Data
The crime data is obtained from https://opendatanederland.org
The population data is obtained from  http://www.metatopos.eu/provincies.html.
The crime data needs to be nested in the following way:

* {'Province': {'crime': [2010, 2011, 2012, 2013]}, etc. }

Province for each province in the netherlands and all crimes in each province and all years for each crime.

## Interactivity
* Nederland button
* Misdrijf button
* Slider
* Map ~ Pie/Line
* Pie ~ Map/Line

### Nederland button
* On click:	Set province to 'Netherlands', set crime to 'Total' (default).

### Misdrijf button ~ Map/Pie/Line
* On click: 	Show all crimes which can be selected.
		When clicked on crime: 	map fills again for corresponding crime.
					Pie updates for selected crime.
					Line updates for selected crime.

### Slider
* On slide:	When slider changes year: Map fills again for corresponding year.
					Pie adjusts to selected year.

### Map ~ Pie/Line
* On hover: 	When the users mouse is on a province that province should light up.
		The part of the pie corresponding to this province should light up.
		Data of the province and selected crime (default=Total) should be displayed.
		Piechart shows relative occurence of chosen crime per province.
* On click: 	Province: The data of the province should be selected for the other visualisations and stay present on screen when nothing else is happening.
		Linechart shows quantity of chosen crime for chosen province over four years.
		Piechart shows relative occurence of chosen crime per province.
		Datamap is filled again using the data of a selected crime

### Pie ~ Map/Line
* On hover:	When a users mouse is on a segment of the piechart it should light up.
		The corresponding province in the map should light up.
		The data of the province and selected crime (default=Total) should be displayed.
		Piechart shows relative occurence of chosen crime per province.
* On click: 	The province is selected, the piechart updates and shows the relative occurance of all crimes in database for the selected province.
		The selected province lights up in the map and stays highlighted untill another province is selected.
		The lineplot shows the data for the selected crime and province.

### Lineplot
* On hover: 	When the users mouse is over the plot, the line lights up (changes color) and the values of each year for a selected crime and a selected province will be displayed.





