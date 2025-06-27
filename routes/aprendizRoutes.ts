import { Router } from "../dependencies/dependencies.ts";
import { getAprendiz,postUser } from '../controller/aprendizController.ts';


const AprendizRouter = new Router();

AprendizRouter.get("/Aprendiz",getAprendiz)
AprendizRouter.post("/Aprendiz",postUser)
AprendizRouter.put("/Aprendiz",()=>{})
AprendizRouter.delete("/Aprendiz/:id",()=>{})


export{AprendizRouter}