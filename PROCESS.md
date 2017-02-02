# WEEK1
# day 1
Wrote README.md, made external play button and pause button for youtube API 

# day 2
Mailed with Neurensics for data. Got the data but it was a .mat file of 9 Gig. Downloaded matlab tried to open it but computer crahes with memory overload.

# day 3
Mailed with Neurensics for smaller files/ files per subject. Got the files and tried to get the data. Datacoherence is so minimal that it cant be used before processing it extensively. Never worked with matlab so would be to much work to convert it in a understandable dataset. Changed my plan to crime in the Netherlands. Got data from internet.

# day 4
This day I worked on nesting the data in the appropriate format using python so that each province is a key and the values are the crimes. The crimes are keys for the data of the four years. This way data.province.crime.year gives wanted data. To do this i first sorted the data so on province to make the script work.

# day 5
Tried to obtain datamap of the netherlands. Could not find a nice datamap so tried a TopoJSON file. Couldn't make it work. So obtained a nice .svg map. With help i was able to display the map on my page.

# WEEK 2
# day 6
Filled the map with simple dataset of provinces total crime. And added a dropdown buttons with no functionality yet. Difficulty with selecting on attribute title, but figured it out.

# day 7
Added piechart, and linegraph

# day 8
wrote separate functions for filling the map with color, filling the pie with data, and drawing the linegraph. Problems with displaying correct y values.

# day 9
Added hover (change opacity) and click (change data in pie and lineplot) events to datamap. To check if the correct data is shown i made some dynamic titles that display selected Province, Crime and Year. Fixed calculations for piechart now shows good data. y axis values still arent good.

# day 10
PRESENTATIONS

# WEEK 3
# day 11
Changed some style. Fixed y-values... margins where to small therefore the first integer of each value was not diplayed. Events where interfearing with eachother could not find a solution.

# day 12
Started to clean-up my code: copy everything seperatly into new file. Made functions.js clean.js clean.html and clean.css. Renamed global variables to be more descriptive to create better eventlistners.

# day 13
Searched for a slider and implemented it in my html. tried to fix pie-map interactions. Lost listners on click so made a window.onclick(startEventListner) function.

# day 14
Slider interacts with all visualizations, also when dragging. The Piechart was showing values now its showing percentages of occurance of a crime in each province of the Netherlands or, when a crime is selected, shows the relative occurance of this crime compared with all the other crimes.

# day 15
PRESENTATIONS

# WEEK 4
# day 16
REALLY start styling with CSS, made one main title with province crime and year for all three visualisations that changes dynamically. Tried to have fixed positions for all objects, fail. Put files in maps.

# day 17
Added Infobutton which contains information of the page and its elements. Added legends. And added y-axis label. Added a anti-zoom function to cover my ass during presentations.

# day 18
Add license, Re-write .md files, finish progressbook, start final report. Because my third graph didnt have a interaction i added a popup containing the values of each year for a specific crime of a specific province.

# day 19

# day 20
PRESENTATIONS
