//using promise 
const AsyncHandler = (fn) => {
    return (req , res, next) => {Promise.resolve(fn(req , res, next)).catch((err) => next(err))}
}

export default AsyncHandler;

//using try and catch block
// const AsyncHandler = (fn) =>async  (rerq , res , next) => {
//     try {
//         await fn(req , res , next);        
//     } catch (error) {
//         console.log('something went wrong' , error);
        
//     }
// }
