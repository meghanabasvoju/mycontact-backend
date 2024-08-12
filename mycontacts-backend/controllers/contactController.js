const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc GET all contacts
//@route GET /api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc POST all contacts
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, gmail, phone } = req.body;
  //if the user not entered any of the information throw an error
  if (!name || !gmail || !phone) {
    res.status(400);
    throw new Error("All Fields are mandatory a validation error");
  }
  const contact = Contact.create({
    name,
    gmail,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//@desc GET individual contacts
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  //if the particular contact id not found throw an error
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }
  res.status(200).json(contact);
});

//@desc update contacts
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  //if the particular contact id not found throw an error
  if (!contact) {
    res.status(400);
    throw new Error("contact not found");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User dont have the permission to update other users contacts"
    );
  }
  res.status(200).json(updatedContact);
});

//@desc delete contacts
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  //if the particular contact id not found throw an error
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }

  await Contact.deleteOne({ _id: req.params.id });

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User dont have the permission to update other users contacts"
    );
  }
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
