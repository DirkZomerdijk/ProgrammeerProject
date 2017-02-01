#Design Document

## Interactivity
### Nederland button
* On click:	Set province to 'Netherlands', set crime to 'Total'(default).
### Misdrijf button ~ Map/Pie/Line
* On click: 	Show all crimes which can be selected.
		When clicked on crime: 	Map fills again for corresponding crime.
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