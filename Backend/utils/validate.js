import { object, string, number } from "yup";
export const registerscheema=object().shape({
  Email:string().email().required('Must not be empty'),
  Password:string().min(6)
})
export const loginscheema=object().shape({
  Email:string().email().required('Must not be empty'),
  Password:string().min(6)
})
export const updateemailcheema=object().shape({
  Email:string().email().required('Must not be empty')
})
export const createServiceSchema = object({
  Users_Id: number().typeError("User ID must be a valid number.").required("User ID is required."),
  Title: string().required("Title is required."),
  Category: string().required("Category is required."),
  Description: string().nullable(),
  Price: number().typeError("Price must be a valid number.").positive("Price must be greater than zero.").required("Price is required."),
});
export const validate=(schema)=>async(req,res,next)=>{
  try {
    await schema.validate(req.body,{abortEarly:false});
    next();
  } catch (error) {
    const errortxt=error.errors.join(",")
    const err=new Error(errortxt)
    next(err)
  }
}