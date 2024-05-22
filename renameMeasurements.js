// Renames all the measurements from the specified machine and saves them to a new etc file

fs = require('fs');
xml2js = require('xml2js');

async function renameMeasurements(clientFolderPath, machineIndex, newNames, loadFilename, saveFilename) {
    try {
        const fileData = fs.readFileSync(`${clientFolderPath}/${loadFilename}`)

        const parser = new xml2js.Parser()
        // Parser returns a promise while converting the XML data
        const res = await parser.parseStringPromise(fileData)
        const xmlDataAsJs = res
        const data = xmlDataAsJs["PROFITEST_M"]
        const database = data["DATABASE"][0]
        const databaseCustomer = database["CUSTOMER"][0]
        const databaseBuilding = databaseCustomer["BUILDING"][0]
        const databaseMachines = databaseBuilding["MACHINE"]

        // Isolating the machine and retrieving the measurements
        const measurements = databaseMachines[machineIndex]["MEASUREMENT"]

        // The measurements can be accessed by an ascending index starting at 0
        const keysMeasurements = Object.keys(measurements)
        const measurementsLength = keysMeasurements.length

        // Check if the number of names matches
        if (newNames.length !== measurementsLength) {
            console.log("Die Anzahl der Messpunkte muss der Anzahl der Messpunktnamen entsprechen.")
            return
        }

        for (i = 0; i < measurementsLength; i++) {
            const currentMeasurement = measurements[i]

            // Access the attributes of the current measurement
            // via the keys '$', 'PARAMETER' and 'RESULT'
            const currentAttributes = currentMeasurement['$'] // access txt-attribute via 'txt'
            currentAttributes['txt'] = newNames[i]
        }  

        // Convert changed data into XML and export it into a file
        const builder = new xml2js.Builder()
        const xml = builder.buildObject(xmlDataAsJs)
        const savingLocation = `${clientFolderPath}/${saveFilename}`
        fs.writeFileSync(savingLocation, xml)
    } catch (err) {
        console.log(err)
    }
}

module.exports = renameMeasurements
