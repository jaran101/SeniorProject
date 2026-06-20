import { object, string, number } from "yup";
export const registerscheema=object().shape({
  Email:string().email().required('Must not be empty').test(
      'no-script-tag',
      'The text must not contain <script> tags or JavaScript code',
      (value) => {
        if (!value) return true; 
        const forbiddenPattern = /<\s*script.*?>.*?<\s*\/\s*script\s*>|javascript:|on\w+=/gis;
        return !forbiddenPattern.test(value);
      }
    ),
  Password:string().min(6).test(
      'no-script-tag',
      'The text must not contain <script> tags or JavaScript code',
      (value) => {
        if (!value) return true; 
        const forbiddenPattern = /<\s*script.*?>.*?<\s*\/\s*script\s*>|javascript:|on\w+=/gis;
        return !forbiddenPattern.test(value);
      }
    )
})
export const loginscheema=object().shape({
  Email:string().email().required('Must not be empty').test(
      'no-script-tag',
      'The text must not contain <script> tags or JavaScript code',
      (value) => {
        if (!value) return true; 
        const forbiddenPattern = /<\s*script.*?>.*?<\s*\/\s*script\s*>|javascript:|on\w+=/gis;
        return !forbiddenPattern.test(value);
      }
    ),
  Password:string().min(6).test(
      'no-script-tag',
      'The text must not contain <script> tags or JavaScript code',
      (value) => {
        if (!value) return true; 
        const forbiddenPattern = /<\s*script.*?>.*?<\s*\/\s*script\s*>|javascript:|on\w+=/gis;
        return !forbiddenPattern.test(value);
      }
    )
})
export const updateemailcheema=object().shape({
  Email:string().email().required('Must not be empty').test(
      'no-script-tag',
      'The text must not contain <script> tags or JavaScript code',
      (value) => {
        if (!value) return true; 
        const forbiddenPattern = /<\s*script.*?>.*?<\s*\/\s*script\s*>|javascript:|on\w+=/gis;
        return !forbiddenPattern.test(value);
      }
    )
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