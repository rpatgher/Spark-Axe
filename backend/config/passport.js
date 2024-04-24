//This checks if someone is actually who they say they are by using the Bearer strategy
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

//Passport: Its like a real life passport to see if i can enter certain parts
//Bearer strategy: Is the badge they use to enter

//So, Passport is the system that handles authentication, and BearerStrategy is one method Passport uses to check if someone is allowed in by checking a special token (the "bearer" token).