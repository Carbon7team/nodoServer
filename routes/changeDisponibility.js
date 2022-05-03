/* eslint-disable no-console */
const {UserOnline} = require('../sequelize');
const router = require("express").Router();




/**
 * @swagger
 * /loginUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *          
 *           type: object
 *           properties:
 *             disponibility:
 *               type: boolean
 *             user_id:
 *               type: string
 *               
 *         required:
 *           - disponibility
 *           - user_id
 *     responses:
 *       '200':
 *         disponibility is updated
 *       '404':
 *         disponibility is not updated
 *       '500':
 *         problem communicating with db
 */

router.post('/changeDisponibility', async (req, res, next) => {
  //check if the username does not exist
  console.log(JSON.stringify(req.body));
  UserOnline.update(
    {
      disponibility: req.body.disponibility,
    },
    {
      where: { user_id : req.body.user_id },
    }
  ) .then((userOnlineUpdated) => {
    console.log(userOnlineUpdated);
    if (userOnlineUpdated ==  1) {
      console.log('disponibility is updated');
      res.status(200).send('disponibility is updated');
    } else {
      console.error('disponibility is not updated');
      res.status(404).send('disponibility is not updated');
    }
  })
  .catch((error) => {
    console.error('problem communicating with db');
    res.status(500).send(error);
  });


});

 
module.exports = router;