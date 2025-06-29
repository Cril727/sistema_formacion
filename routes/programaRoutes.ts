import { getProgramas, postPrograma, putPrograma, deletePrograma } from "../controller/programaController.ts";
import { Router } from "../dependencies/dependencies.ts";


const ProgramaRouter = new Router();

ProgramaRouter.get("/programas",getProgramas)
ProgramaRouter.post("/programa",postPrograma)
ProgramaRouter.put("/programa",putPrograma)
ProgramaRouter.delete("/programa/:id",deletePrograma)


export {ProgramaRouter}