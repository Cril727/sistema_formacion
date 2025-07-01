import { getProfesion, postProfesion, putProfesion, deleteProfesion } from "../controller/profesionController.ts";
import { Router } from "../dependencies/dependencies.ts";


const ProfesionRouter = new Router();

ProfesionRouter.get("/profesiones",getProfesion);
ProfesionRouter.post("/profesion",postProfesion);
ProfesionRouter.put("/profesion",putProfesion);
ProfesionRouter.delete("/profesion/:id",deleteProfesion);


export { ProfesionRouter }