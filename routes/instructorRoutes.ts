import { Router } from "../dependencies/dependencies.ts";
import {
  getInstructor,
  postInstructor,
  putInstructor,
  deleteInstructor,
} from "../controller/instructorController.ts";

const InstructorRouter = new Router();

InstructorRouter.get("/Instructores", getInstructor);         // GET lista
InstructorRouter.post("/Instructor", postInstructor);         // POST nuevo
InstructorRouter.put("/Instructor", putInstructor);           // PUT actualizar
InstructorRouter.delete("/Instructor/:id", deleteInstructor); // DELETE por ID

export { InstructorRouter };
