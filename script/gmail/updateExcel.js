const xlsx = require('xlsx')

/*
sample data argument = ['23:30 13-06-23','23:32 13-06-23'] //used in order of emails.
*/
async function updateExcel(sheetPath,data){
    const workbook = xlsx.readFile(sheetPath);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
      workbook.Sheets[workbook_sheet[0]]
    );
    for(let i=0;i<data.length;i++){
        workbook_response[i]["Sent"] = data[i]
    }
    const ws = xlsx.utils.json_to_sheet(workbook_response)
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'Responses')
    xlsx.writeFile(wb, sheetPath)

}

// updateExcel("./test.XLSX",['23:33 13-06-23','23:32 13-06-23','23:35 13-06-23','23:45 13-06-23']).then((res)=>{
//     console.log(res)
//   }).catch((err)=>{console.log("The file is busy could'nt update.")})

module.exports = {updateExcel}