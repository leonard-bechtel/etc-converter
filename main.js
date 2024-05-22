// Handles all the I/O statements made by the user

// Functionality of main method
// 1. Ask the user for the machine id
// 2. Check if the passed machine id exists in the etc file
// 3. If the machine id exists ask the user for the list of new measurement names
// 4. Check if the number of measurments and the number of names are the same and rename the measuements
// 5. Save the new etc file in the specified location

// ##############################################

"use strict"
const fs = require("fs");
const ps = require("prompt-sync");
const prompt = ps();
const getMachineById = require('./getMachineById');
const renameMeasurements = require('./renameMeasurements');

async function renameMeasurementsForOneMachine(clientFolderPath, machineId, measurementNames, loadFilename, saveFilename) {
    // Check whether machine with the specified machine id exists
    try {
        const machineIndex = await getMachineById(machineId, clientFolderPath, loadFilename)

        // Rename the measurement points
        await renameMeasurements(clientFolderPath, machineIndex, measurementNames, loadFilename, saveFilename)
    } catch {
        console.log(`Es konnte keine Machine mit der ID '${machineId}' gefunden werden.`)
        return
    }
}

async function main() {
    // Asking for the name of the unique client folder
    console.log("Bitte gib den Namen des Kundenordners an, der die Rohdaten enthält: ")
    const clientFolderName = prompt()

    // Creating the path to the client folder and check if it exists
    const clientFolderPath = `Kunden/${clientFolderName}`

    if (!fs.existsSync(clientFolderPath)) {
        console.log(`Es gibt keinen Kundenordner namens '${clientFolderName}'. Bitte überprüfe, ob du diesen im Ordner 'Kunden' gespeichert hast.`)
        return
    }

    // Creating the path to the data which contains the measurements and check if it exists
    const rawDataPath = `${clientFolderPath}/Rohdaten.etc`
    if (!fs.existsSync(rawDataPath)) {
        console.log(`Im Ordner '${clientFolderName}' liegen keine Rohdaten. Bitte speichere diese unter dem Namen 'Rohdaten.etc' in diesem Ordner ab.`)
        return
    }
    
    // Asking for the new measurement names
    console.log("Bitte speichere die neuen Messpunktbezeichnungen im entsprechenden Kundenordner ab unter 'Messpunktnamen.txt' und bestätige mit ENTER.",
                "Stelle sicher, dass jeder Messpunktname in einer neuen Zeile steht und die Textdatei keine Leerzeilen am Ende enthält.")
    prompt()

    // Extracting the machine ids and measurement names from the textfile "Messpunktname.txt"
    const newNames = []
    const fileContent = fs.readFileSync(`${clientFolderPath}/Messpunktnamen.txt`, 'utf-8')
    fileContent.split(/\r?\n/).forEach(line => {
        newNames.push(line)
    })

    // Create array of arrays with machine id as the first entry
    let index = 0
    const newNamesArray = [[]]
    for (let i = 0; i < newNames.length; i++) {
        if (newNames[i] === "Ende") {
            index += 1
            newNamesArray[index] = []
        } 
        else if (newNames[i] === "Schließen") {
            break
        }
        else {
            newNamesArray[index].push(newNames[i])
        }
    }
    newNamesArray.pop()

    // Renaming the measurement points for every machine id
    let currentMachineId
    let currentMeasurementNames = []
    let loadFilename = "Rohdaten.etc"
    let saveFilename = "Umbenannt.etc"
    for (let i = 0; i < newNamesArray.length; i++) {
        const currentNames = newNamesArray[i]
        if (i > 0) {
            loadFilename = "Umbenannt.etc"
        }
        for (let j = 0; j < currentNames.length; j++) {
            if (j === 0) { 
                currentMachineId = currentNames[0]
                continue
            }
            else {
                currentMeasurementNames.push(currentNames[j])
            }
        }

        // Execute the renaming for one machine
        await renameMeasurementsForOneMachine(clientFolderPath, currentMachineId, currentMeasurementNames, loadFilename, saveFilename)
        currentMeasurementNames = []
    }
}

main()