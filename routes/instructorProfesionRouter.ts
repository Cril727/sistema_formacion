import { getInstructorProfesion, postInstructoresProfesiones, putInstructoresProfesiones, deleteInstructoresProfesiones } from "../controller/instructorProfesionController.ts";
import { Router } from "../dependencies/dependencies.ts";


const InstructorProfesionRouter = new Router();

InstructorProfesionRouter.get("/InstructoresProfesiones",getInstructorProfesion);
InstructorProfesionRouter.post("/InstructorProfesion",postInstructoresProfesiones);
InstructorProfesionRouter.put("/InstructorProfesion",putInstructoresProfesiones);
InstructorProfesionRouter.delete("/InstructorProfesion/:instructorId/:profesionId",deleteInstructoresProfesiones);


export {InstructorProfesionRouter}