import express from "express"
import { verifyToken } from "../middleware/authMidlleware.js"
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/contactsController.js"

const contactRoute = express.Router()


contactRoute.post("/search",verifyToken, searchContacts )
contactRoute.get("/get-contact-for-dm",verifyToken, getContactsForDMList )
contactRoute.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactRoute;