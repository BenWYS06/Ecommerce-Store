import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          user = await User.findOne({
            email: profile.emails[0].value,
          });

          if (user) {
            user.googleId = profile.id;
            user.provider = "google";
            if (!user.avatar) {
              user.avatar = profile.photos?.[0]?.value || "";
            }

            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos?.[0]?.value || "",
              googleId: profile.id,
              provider: "google",
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@users.noreply.github.com`;

        let user = await User.findOne({
          githubId: profile.id,
        });

        if (!user) {
          user = await User.findOne({
            email,
          });

          if (user) {
            user.githubId = profile.id;
            user.provider = "github";

            if (!user.avatar) {
              user.avatar = profile.photos?.[0]?.value || "";
            }

            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              avatar: profile.photos?.[0]?.value || "",
              githubId: profile.id,
              provider: "github",
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          facebookId: profile.id,
        });

        if (!user) {
          if (email) {
            user = await User.findOne({
              email,
            });
          }

          if (user) {
            user.facebookId = profile.id;
            user.provider = "facebook";

            if (!user.avatar) {
              user.avatar = profile.photos?.[0]?.value || "";
            }

            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName,
              email: email || "",
              avatar: profile.photos?.[0]?.value || "",
              facebookId: profile.id,
              provider: "facebook",
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
