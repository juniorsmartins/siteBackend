import { Router } from "express";
import { NewsGetController } from "../controllers/news/news-get-controller.ts";
import { NewsCreateController } from "../controllers/news/news-create-controller.ts";
import { NewsDeleteController } from "../controllers/news/news-delete-controller.ts";
import { NewsUpdateController } from "../controllers/news/news-update-controller.ts";
import { validateSchemaMiddleware } from "../middlewares/validate-schema-middleware.ts";
import { newsSchemaValidation } from "../validation/news-schema-validation.ts";
import { NewsSearchController } from "../controllers/news/news-search-controller.ts";

const newsRouter = Router();
const newsGetController = new NewsGetController();
const newsDeleteController = new NewsDeleteController();
const newsUpdateController = new NewsUpdateController();
const newsCreateController = new NewsCreateController();
const newsSearchController = new NewsSearchController();

newsRouter.get("/:id", newsGetController.findById);
newsRouter.delete("/:id", newsDeleteController.deleteById);
newsRouter.put("/:id", validateSchemaMiddleware(newsSchemaValidation), newsUpdateController.updateById);
newsRouter.post("/", validateSchemaMiddleware(newsSchemaValidation), newsCreateController.create);
newsRouter.get("/", newsSearchController.searchOffsetBased);

export { newsRouter };
