# Proposing EEG Dashboard
- Name:			Dirk Zomerdijk
- Studentnumber: 	10530274
- Education: 		Bcs. Beta-Gamma, Neurobiologie

## Paragraph Summary
- Introduction
- The Proposal Process
	*Goals	
	* Visual Sketch
	* Datasets Used
	* Decomposing The Problem
	* APIs
	* Technical Problems
- MVP


## Introduction
This projects goal is to create a dashboard on which various data is displayed for
the sake of conspectus and analysis. 

The displayed visualizations will be:
- EEG data 
- The video shown while collecting data
- The behavioral data
- The average of the behavioral data over all subjects. 

All of this is displayed synchronous. This way the user has a consolidated view of the data obtained during the experiment and a way to analyse it.

## The Proposal Process

### Goals

* Make a clear overview for the user of the data obtained during an EEG experiment for conspectus and analysis.
* Make the overview dynamic. Control the time of all visualizations using a slider.
* Make a dropdown menu to switch between subjects/ movies.

### Visual Sketch

### Datasets Used
The datasets used for this project are EEG and te behavioral data that comes with it.
- The EEG data will be plotted in a linegraph. The y-axis will show the EEG value and x-axis the time of the video
- The behavioral data will be plotted as a word and the choice of the subject (yes or no). 


### Decomposing the problem
The problem can be decomposed into six smaller problems.
<ol>
<li>The visualization of the EEG data.</li>
2. Displaying the stimulus video. 
3. Displaying the behavioral data.
4. Displaying a frequencytable (or piechart) with a average of all subjects to analyse the choice.
5. Synchronize all four visualisations dynamically. 
6. Displaying a slider which controls all visualisations timelines.
</ol>

### APIs
For displaying the video a Youtube API will be used.


### Technical Problems
A problem that can emerge is that the slider may not proparly work for the Youtube component.

## MVP
The minimum viable product is considered reached if all visualizations are correct and start synchronically.
This means that the EEG data will run parallel with the video, and that the behavioral data obtained during the experiment
will be displayed on the right moment in time.


