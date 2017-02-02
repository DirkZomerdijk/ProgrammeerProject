# Final Report

## Description
This webpage and its visualizations give information about crime in the Netherlands. With this page you can explore the quantity and relative occurance of certain crimes, either for the entier Netherlands or for each province individually.
![](doc/finalVersion.png)

## Technical Design
All visualizations on the page are interactive and use the same dataset. Each visualization is positioned statically around the titles that tell you the selected province, crime and year.
* The datamap shows the relative occurance of a selected crime in the Netherlands by filling each province with a color corresponding to the prevalence of that crime in that province.
* The piechart shows more exact the relative occurance in each province using the center of the pie which shows the percentage corrected for number of inhabitans.
* The lineplot shows the quantity of a selected crime in a selected province over the course of four years (2010-2013).
* The two buttons 'Nederland' and 'Misdrijven' can be used to set province to Netherlands (This is not a province.. but yeah) and crime to total (all crimes), or to select a specific crime respectivily.
* The slider can be dragged to select a year. The datamap and piechart will update while dragging. 
* The info button show how each visualization can be used to get data.

The datamap and piechart not only show data. They also can be used to select a crime or province or to take a quick look at the data. When the users mouse is on a province that province is highlighted, the global title changes, and the corresponding pie segment will light up with the corresponding value in percentage.
If the user clicks on the province it is selected. The province stays highlighted on the map, the global titles changes to the province untill another province is selected, the piechart shows the relative occurance of all the crimes in the dataset for that province and the lineplot updates to show the quantity of a selected crime for the selected province.
While the piechart segments are representing provinces these can be hovered and clicked to select a province in the same way the datamap does. When the segments represent crimes they can be clicked to select a crime. When a crime is selected the datamap and lineplot updates for that crime. The 'Misdrijf' button can also be used to select a crime. The piechart still shows the relative occurance of the crime.
When the user hovers there mouse over the lineplot the exact values of each year for a pecific crime and province will be displayed in a popup.

To create these interactions event handlers are used for each element on the page. For each visualization a function is written to update it whenever needed. To get the correct data for each visualization a function is written. For calculating the fill colors and for filling the datamap functions are written. 
For calculating the percentage shown in the piechart a function is written and last all eventlistners are put in a function so that after each visualization update the handlers work again.

