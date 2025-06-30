import { getProfesion } from "../controller/profesionController.ts";
import { Router } from "../dependencies/dependencies.ts";


const ProfesionRouter = new Router();

ProfesionRouter.get("/profesiones",getProfesion);
ProfesionRouter.post("/profesion",()=>{});
ProfesionRouter.put("/profesion",()=>{});
ProfesionRouter.delete("/profesion/:id",()=>{});


export { ProfesionRouter }