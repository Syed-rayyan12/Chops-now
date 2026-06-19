// Required by modules imported at test load time (utils/jwt fails fast without
// a secret; payment routes need a webhook secret). Values are test-only.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
