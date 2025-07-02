import { Router } from "../dependencies/dependencies.ts";
import { getRelaciones, postRelacion,updateRelacion,deleteRelacion } from "../controller/fichaHasAprendizInstructorController.ts";

const RelacionRouter = new Router();

RelacionRouter.get("/Relacion", getRelaciones);
RelacionRouter.post("/Relacion", postRelacion);
RelacionRouter.put("/Relacion",updateRelacion);
RelacionRouter.delete("/Relacion/:ficha_idficha/:aprendiz_idaprendiz/:instructor_idinstructor", deleteRelacion);

export { RelacionRouter };
