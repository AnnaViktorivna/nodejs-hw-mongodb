import createHttpError from 'http-errors';
import { Session } from '../db/session.js';
import { User } from '../db/User.js';

export const authenticate = async (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    return next(createHttpError(401, 'Authorization header not found'));
  }
  const [bearer, token] = header.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(
      createHttpError(401, 'Authorization header should be of bearer type'),
    );
  }
  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Session expired'));
  }
  const user = await User.findById(session.userId);
  if (!user) {
    return next(
      createHttpError(401, 'User assosiated with this session not found'),
    );
  }

  req.user = user;
  return next();
};
