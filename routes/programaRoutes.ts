import { getProgramas, postPrograma } from "../controller/programaController.ts";
import { Router } from "../dependencies/dependencies.ts";


const ProgramaRouter = new Router();

ProgramaRouter.get("/programas",getProgramas)
ProgramaRouter.post("/programa",postPrograma)
ProgramaRouter.put("/programa",()=>{})
ProgramaRouter.delete("/programa",()=>{})


export {ProgramaRouter}