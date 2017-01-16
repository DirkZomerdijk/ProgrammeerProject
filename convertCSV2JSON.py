import csv;
import json;

csvFile = 'data/dataSorted.csv'
jsonFile = 'data/dataCrimi.json'

csvFile = open(csvFile, 'r')
jsonFile = open(jsonFile, 'w')

headers = csvFile.readline().replace('\n', '').split(',')
Reader = csv.DictReader(csvFile, headers)

data = {}
for row in Reader:
	
	currentReg = row["Regio"]
	currentMis = [row['Misdrijf']][0]

	if currentReg in data:
		data[currentReg][currentMis] = [row['2010'],row['2011'],row['2012'],row['2013']]
	else:
		data[currentReg] = {}
		data[currentReg][currentMis] = [row['2010'],row['2011'],row['2012'],row['2013']]

json.dump(data, jsonFile, indent = 4)
