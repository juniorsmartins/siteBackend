import { Router } from "express";
import { NewsGetController } from "../controllers/news/news-get-controller.ts";
import { NewsCreateController } from "../controllers/news/news-create-controller.ts";
import { NewsDeleteController } from "../controllers/news/news-delete-controller.ts";
import { NewsUpdateController } from "../controllers/news/news-update-controller.ts";
import { validateSchemaMiddleware } from "../middlewares/validate-schema-middleware.ts";
import { newsSchemaValidation } from "../validation/news-schema-validation.ts";

const newsRouter = Router();
const newsGetController = new NewsGetController();
const newsDeleteController = new NewsDeleteController();
const newsCreateController = new NewsCreateController();
const newsUpdateController = new NewsUpdateController();

newsRouter.get("/:id", newsGetController.findById);
newsRouter.delete("/:id", newsDeleteController.deleteById);
newsRouter.post("/", validateSchemaMiddleware(newsSchemaValidation), newsCreateController.create);
newsRouter.put("/:id", validateSchemaMiddleware(newsSchemaValidation), newsUpdateController.updateById);

export { newsRouter };
