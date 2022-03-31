var express = require('express');
var router = express.Router();
const db = require('../database/tecnicoDB')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });
  // define the home page route
   router.post('/loginTecnico', async function(req, res) {
    console.log(req.body);
    var data = req.body;
    res.send(await db.getTecnicoLogin(data.username, data.password));
  });

  module.exports = router;