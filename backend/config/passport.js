import passport from "passport";
import BearerStrategy from "passport-http-bearer";
import User from "../models/User.js";

passport.use(new BearerStrategy(
    async (token, done) => {
        try {
            const user = await User.findOne({ where: { token } });
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


export default passport;