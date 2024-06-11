import createHttpError from 'http-errors';
import { Types } from 'mongoose';

export const validateId =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    // check developers on server
    if (!id) {
      throw new Error('Id is not found!');
    }
    // check client
    if (!Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, 'Id is not valid!'));
    }

    return next();
  };
