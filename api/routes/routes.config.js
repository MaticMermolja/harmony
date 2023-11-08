const express = require('express');
const userController = require('../workers/UserWorker.js');
const initController = require('../workers/InitWorker.js');
const boardingController = require('../workers/BoardingWorker.js');
const adminController = require('../workers/AdminWorker.js');
const openAIController = require('../workers/OpenAIWorker.js');
const dbController = require('../workers/DBWorker.js');
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
        verifyUserMiddleware.validateSession(1),
        boardingController.getBoardingLevel
      ]);

router.post('/boarding/:step', [
        verifyUserMiddleware.validateSession(1),
        boardingController.calculateBoarding
      ]);

// Admin
router.get('/admin/action/list', [
        verifyUserMiddleware.validateSession(1),
        adminController.listAllActions
      ]);

router.put('/admin/action/create', [
        verifyUserMiddleware.validateSession(2),
        adminController.putCreateNewAction
      ]);      

router.patch('/admin/action/patch/:id', [
        verifyUserMiddleware.validateSession(2),
        adminController.patchUpdateAction
      ]);      
      
router.get('/user/:id', [
        verifyUserMiddleware.validateSession(2),
        userController.findById
      ]);

router.get('/users', [
      verifyUserMiddleware.validateSession(1),
      userController.listAllUsers
    ]);

router.get('/user-inspiration-quote', [
      verifyUserMiddleware.validateSession(1),
      openAIController.fetchInspirationQuote
    ]);    

router.delete('/user/delete/:id', [
      verifyUserMiddleware.validateSession(2),
      userController.deleteById
    ]);

// Utils
router.get('/questions/get', initController.showQuestions);
router.get('/openai/get/quote', openAIController.createInspirationQuote);
router.get('/ratings/get/all', [
          verifyUserMiddleware.validateSession(2),
          boardingController.listAllUserRatings
        ]);

router.post('/mark-as-done', [
  verifyUserMiddleware.validateSession(1),
  userController.markActionAsDone
]);            

// DB
router.post('/db/delete', dbController.deleteAllDbData);
router.post('/db/init', dbController.initAppData);
router.get('/db', dbController.showDBInit);

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
         url: "https://localhost:3000/api",
         description: "Secure development server for testing",
       },
       {
         url: "http://localhost:3000/",
         description: "Development server for testing",
       }
     ],
   },  
   apis: ["./models/*.js", "./controllers/*.js", "./middlewares/*.js"],
 });
 

// Swagger
router.get("/swagger.json", (request, response) =>
   response.status(200).json(swaggerDocument)
);

router.get("/api/swagger.json", (request, response) =>
   response.status(200).json(swaggerDocument)
);

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

router.get('/user-stats', [
  verifyUserMiddleware.validateSession(1),
  userController.showUserView
]);

module.exports = router;