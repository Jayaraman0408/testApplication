const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const authController = require("../controllers/auth.controller");
const couponController = require("../controllers/coupon.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    authController.signup
  );
  app.post("/api/auth/signin",authJwt.verifyToken, authController.signin);
  app.post("/api/auth/createCoupon",authJwt.verifyToken,couponController.createCoupon );
  app.put("/api/auth/couponStatusUpdate",authJwt.verifyToken,couponController.couponStatusUpdate ); 
  app.delete("/api/auth/deleteCoupon",authJwt.verifyToken,couponController.deleteCoupon ); 
  app.get("/api/auth/getCoupon",authJwt.verifyToken,couponController.getCoupon ); 
  app.put("/api/auth/updateCoupon",authJwt.verifyToken,couponController.updateCoupon ); 
  app.get("/api/auth/getListSortSeach",authJwt.verifyToken,couponController.getListSortSeach );
};