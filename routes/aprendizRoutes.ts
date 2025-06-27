import { Router } from "../dependencies/dependencies.ts";
import { getAprendiz } from '../controller/aprendizController.ts';


const AprendizRouter = new Router();

AprendizRouter.get("/Aprendiz",getAprendiz)
AprendizRouter.post("/Aprendiz",()=>{})
AprendizRouter.put("/Aprendiz",()=>{})
AprendizRouter.delete("/Aprendiz",()=>{})


export{AprendizRouter}