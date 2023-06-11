// Requiring the module
const xlsx = require('xlsx')
async function readExcel(sheetPath,arr){
    const workbook = xlsx.readFile(sheetPath);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
      workbook.Sheets[workbook_sheet[0]]
    );
    // console.log(workbook_response)
    arr = []
    for(var key in workbook_response[0]){
      arr.push(key)
    }
    let required_format = {}
    await arr.forEach(element => {
      required_format[element.trim()] = [];
      workbook_response.forEach(e=>{
        required_format[element.trim()].push(e[element])
      })
    });
    return required_format
}

// readExcel("./trial.XLSX").then((res)=>{
//   console.log(res)
// })
module.exports = {readExcel}
/*
required format :
{
    Email:["verma.arpit078@gmail.com","blabbla429@gmail.com"],
    Name:["Arpit","Bla"]
}
*/