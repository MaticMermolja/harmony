const express = require('express');
const userController = require('../workers/UserWorker.js');
const initController = require('../workers/InitWorker.js');
const boardingController = require('../workers/BoardingWorker.js');
const adminController = require('../workers/AdminWorker.js');
const openAIController = require('../workers/OpenAIWorker.js');
const verifyUserMiddleware = require('../middlewares/verifyUser');
const config = require('../env.js');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const ADMIN = config.permissionLevels.ADMIN;
const NORMAL_USER = config.permissionLevels.NORMAL_USER;

const router = express.Router();

router.post('/auth/login', [
        verifyUserMiddleware.hasAuthValidFields,
        verifyUserMiddleware.isPasswordAndUserMatch,
        userController.executeLoginUser
    ]);

router.post('/auth/register', userController.executeRegisterUser);

// Boarding
router.get('/utils/getBoardingLevel', [
        verifyUserMiddleware.validateSession(NORMAL_USER),
        boardingController.getBoardingLevel
      ]);

router.post('/boarding/:step', [
        verifyUserMiddleware.validateSession(NORMAL_USER),
        boardingController.calculateBoarding
      ]);

// Admin
router.get('/admin/action/list', [
        verifyUserMiddleware.validateSession(NORMAL_USER),
        adminController.listAllActions
      ]);

router.put('/admin/action/create', [
        verifyUserMiddleware.validateSession(ADMIN),
        adminController.putCreateNewAction
      ]);      

router.patch('/admin/action/patch/:id', [
        verifyUserMiddleware.validateSession(ADMIN),
        adminController.patchUpdateAction
      ]);      
      
router.get('/user/:id', [
        verifyUserMiddleware.validateSession(ADMIN),
        userController.findById
      ]);

router.get('/users', [
      verifyUserMiddleware.validateSession(ADMIN),
      userController.listAllUsers
    ]);  

router.delete('/user/delete/:id', [
      verifyUserMiddleware.validateSession(ADMIN),
      userController.deleteById
    ]);

router.get('/ratings/get/all', [
          verifyUserMiddleware.validateSession(ADMIN),
          boardingController.listAllUserRatings
        ]);

router.get('/user-inspiration-quote', [
  verifyUserMiddleware.validateSession(NORMAL_USER),
  openAIController.fetchInspirationQuote
]);  

router.post('/user-inspiration-image', [
  verifyUserMiddleware.validateSession(NORMAL_USER),
  openAIController.fetchInspirationalImage
]);  

router.post('/mark-as-done', [
  verifyUserMiddleware.validateSession(NORMAL_USER),
  userController.markActionAsDone
]);

router.get('/user-stats', [
  verifyUserMiddleware.validateSession(NORMAL_USER),
  userController.showUserView
]);

router.get('/docs/api', (request, response) => {
  response.redirect('/docs');
});

const swaggerDocument = swaggerJsDoc({
   definition: {
     openapi: "3.0.3",
     info: {
       title: "Demo",
       version: "0.1.0",
       description:
         "Life App Demo",
     },
     servers: [
       {
         url: "https://inharmonyapp.com/api",
         description: "Production swagger",
       }
     ],
   },  
   apis: ["./models/*.js", "./controllers/*.js", "./middlewares/*.js"],
 });

// Swagger
router.get("/swagger.json", (request, response) =>
   response.status(200).json(swaggerDocument)
);

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

module.exports = router;