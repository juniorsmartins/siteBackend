import { isValidObjectId } from "mongoose";
import { MESSAGES_ERROR } from "../error/error-messages.ts";
import { AppError } from "../error/app-error.ts";

export const validarFormatoId = (id: string): void => {
    if (!isValidObjectId(id)) {
        throw new AppError(MESSAGES_ERROR.GERAL.ID_INVALIDO, 400);
    }
}
