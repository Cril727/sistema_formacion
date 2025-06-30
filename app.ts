import { Application, oakCors } from "./dependencies/dependencies.ts";
import { AprendizRouter } from "./routes/aprendizRoutes.ts";
import { FichaRouter } from "./routes/fichaRoutes.ts";
import { ProfesionRouter } from "./routes/profesionRoutes.ts";
import { ProgramaRouter } from "./routes/programaRoutes.ts";

const app = new Application();

app.use(oakCors())

const routes = [AprendizRouter,FichaRouter,ProgramaRouter,ProfesionRouter];

routes.forEach(route=>{
    app.use(route.routes());
    app.use(route.allowedMethods())
})


console.log("Corriendo en el 8000")
app.listen({port:8000})
