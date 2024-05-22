// Gets the machine id as an input and returns the machine index if it exists and error code -1 otherwise

fs = require('fs');
xml2js = require('xml2js');

// Function to check if the machine specified by the machine id exists; the machine id gets handed over as an argument by the user
function getMachineById(machineId, path, loadFilename) {

    const finalPath = `${path}/${loadFilename}`
    
    return new Promise((resolve, reject) => {
        fs.readFile(finalPath, function(err, data) {
            if (err) throw new Error(err)
        
            const parser = new xml2js.Parser()
        
            // Parser returns a promise while converting the XML data
            parser.parseStringPromise(data)
                .then(function(res) {
                    // Conversion of the XML data into a JavaScript object and accessing of the database         
                    const xmlDataAsJs = res
                    const data = xmlDataAsJs["PROFITEST_M"]
                    const database = data["DATABASE"][0]
                    const databaseCustomer = database["CUSTOMER"][0]
                    const databaseBuilding = databaseCustomer["BUILDING"][0]
                    const databaseMachines = databaseBuilding["MACHINE"]
                    const machinesIndexes = Object.keys(databaseMachines)
        
                    // Create an array with the machine id's to check if the machine id which is entered by the user exists
                    const numberMachines = machinesIndexes.length
                    const machineIds = []
                    for (let i = 0; i < numberMachines; i++) {
                        const currentMachine = databaseMachines[i]
                        const currentMachineId = currentMachine["$"]["id"]
                        machineIds.push(currentMachineId)
                    }
                    
                    // Return -1 as an error code if the machine does not exist
                    if (!machineIds.includes(machineId)) {
                        reject(-1)
                    }
    
                    // Get the correct machine index and extract the machine from the database
                    const machineIndex = machineIds.findIndex(id => id === machineId) // returns the index of the correct machine
    
                    resolve(machineIndex)
                })
                .catch(function(err) {
                    throw Error(err)
                })
        })
    })
}

module.exports = getMachineById

