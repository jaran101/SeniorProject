const createError=(code,msg)=>{
  const err= new Error(msg)
  err.code=code
  throw err
}
export default createError