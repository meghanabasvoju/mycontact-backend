const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController.js");
const validateToken = require("../middleware/validateTokenHandler.js");

//add the validateToken middleware to all the routes
router.use(validateToken);

//get and create all contacts
router.route("/").get(getContacts).post(createContact);

//get,update,delete a particular contact
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
