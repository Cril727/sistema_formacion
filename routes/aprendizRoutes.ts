import { Router } from "../dependencies/dependencies.ts";
import { getAprendiz,postAprendiz,putAprendiz,deleteAprendiz } from '../controller/aprendizController.ts';


const AprendizRouter = new Router();

AprendizRouter.get("/Aprendiz",getAprendiz)
AprendizRouter.post("/Aprendiz",postAprendiz)
AprendizRouter.put("/Aprendiz",putAprendiz)
AprendizRouter.delete("/Aprendiz/:id",deleteAprendiz)


export{AprendizRouter}