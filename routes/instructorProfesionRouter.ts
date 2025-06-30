import { getInstructorProfesion, postInstructoresProfesiones } from "../controller/instructorProfesionController.ts";
import { Router } from "../dependencies/dependencies.ts";


const InstructorProfesionRouter = new Router();

InstructorProfesionRouter.get("/InstructoresProfesiones",getInstructorProfesion);
InstructorProfesionRouter.post("/InstructorProfesion",postInstructoresProfesiones);
InstructorProfesionRouter.put("/InstructorProfesion",()=>{});
InstructorProfesionRouter.delete("/InstructorProfesion",()=>{});


export {InstructorProfesionRouter}