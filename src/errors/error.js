// errorMiddleware.js
export const errorHandler = (statusCode, message) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};


// export function errorHandler(err, req, res, next) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
  


// export function errorHandler(err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
  
  
//   export const errorHandler=(err, req, res, next)=> {
//     console.warn("bbb")
//     if(err){
//         console.log("an error ",err)
//         if(err instanceof RecordNotFoundError){
//             res.status(404)
//             return res.view('templates/404.ejs')
//           }
//         console.error(err.stack);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
    
// }