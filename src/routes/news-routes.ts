import { Router } from "express";
import { NewsGetController } from "../controllers/news/news-get-controller.ts";
import { NewsCreateController } from "../controllers/news/news-create-controller.ts";
import { NewsDeleteController } from "../controllers/news/news-delete-controller.ts";
import { validateSchemaMiddleware } from "../middlewares/validate-schema-middleware.ts";
import { newsCreateSchemaValidation } from "../validation/news-schema-validation.ts";

const newsRouter = Router();
const newsGetController = new NewsGetController();
const newsDeleteController = new NewsDeleteController();
const newsCreateController = new NewsCreateController();

newsRouter.get("/:id", newsGetController.buscarPorId);
newsRouter.delete("/:id", newsDeleteController.deletarPorId);
newsRouter.post("/", validateSchemaMiddleware(newsCreateSchemaValidation), newsCreateController.criar);

export { newsRouter };
