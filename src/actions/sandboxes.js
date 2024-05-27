import { Admin } from "../admin/admin.js"
import { RecordNotFoundError } from "../errors/record_not_found.js";

export const listSandboxes=(req, res) => {
    const sql="SELECT * from sandbox"
    Admin.gedDb().query(sql, function (err, sandboxes) {
        if (err) throw err;
        res.render('index.ejs', { "sandboxes": sandboxes });
    })
}

export const loadSandbox=(req, res,callback) => {
    // let tagSandBox=req.query.sb||"001"
    if(!req.query.sb){
        callback(new RecordNotFoundError("Page inexistante"),null)
        return
    }
    const query = 'SELECT * FROM sandbox WHERE tag = ?';
    const values = [req.query.sb];

    // Use a parameterized query to prevent SQL injection
    Admin.gedDb().query(query, values, (error, results, fields) => {
        if (error) {
            callback(error, null);
    
        } else {
            // res(null, results);
            if(results===undefined||results.length===0){

                // callback(new RecordNotFoundError("Page inexistante"),null)
                badAdress()
            }
            else{
                //RAF ne pas rediriger mais juste charger la page ci dessous
                res.redirect("sandbox.html?sb="+results[0].tag)
            }
        }
    })
}
function badAdress(){
    res.writeHead(404,{"Content-Type": "text/html;charset=utf-8"})
    res.end("Page non trouvée")
}


// load sanbox in a Route way format (like sandbox/001)
// export const loadSandbox=(req, res,callback) => {
//     if(!req.params.tag){
//         console.log("aaaaa")
//         callback(new RecordNotFoundError("Page inexistante"),null)
//         return
//     }
    
//     const query = 'SELECT * FROM sandbox WHERE tag = ?';
//     const values = [req.params.tag];

//     // Use a parameterized query to prevent SQL injection
//     Admin.gedDb().query(query, values, (error, results, fields) => {
//         if (error) {
//             callback(error, null);
           
//         } else {
//             // res(null, results);
//             if(results===undefined||results.length===0){
//                 console.log("noooo",results);

//                 callback(new RecordNotFoundError("Page inexistante"),null)
//             }
//             else{
//                 console.log("yeah",results);
//                 res.render('sandbox.ejs',{sandbox:results[0]})
//                 // res.render('sandbox.html?br='+results[0].tag)
//             }
//         }
//     });
    
// }