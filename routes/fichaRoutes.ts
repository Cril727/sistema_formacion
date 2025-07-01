import { Router } from "../dependencies/dependencies.ts";
<<<<<<< HEAD
import { getFicha, postFicha, putFicha, deleteFicha } from "../controller/fichaController.ts";

const FichaRouter = new Router();

FichaRouter.get("/Ficha", getFicha);
FichaRouter.post("/Ficha", postFicha);
FichaRouter.put("/Ficha", putFicha);
FichaRouter.delete("/Ficha/:id", deleteFicha);

export { FichaRouter };
=======
import { getFicha, postFicha } from "../controller/fichaController.ts";

const FichaRouter = new Router()

FichaRouter.get("/Fichas",getFicha)
FichaRouter.post("/Ficha",postFicha)

export{FichaRouter}
>>>>>>> origin/main
