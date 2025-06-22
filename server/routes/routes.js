const express = require("express")
const router = express.Router()
const {login,signup} = require("../controllers/auth")
const {createScheme,getallScheme,deleteScheme,updateScheme,testAuth} = require("../controllers/scheme")
const {createEligibility} = require("../controllers/eligibility")
const {createFeedback,getallFeedback} = require("../controllers/feedback")
const {addDetails} = require("../controllers/additionaldetails")

const {isAuth,isUser,isAdmin} = require("../middlewares/auth")

router.post("/login",login)
router.post("/signup",signup)

// Test route to check authentication
router.get("/testAuth",isAuth,isAdmin,testAuth)

router.post("/createScheme",isAuth,isAdmin,createScheme)
router.get("/getScheme",getallScheme)
router.put("/updateScheme/:id",isAuth,isAdmin,updateScheme)
router.delete("/deleteScheme/:id",isAuth,isAdmin,deleteScheme)

router.post("/createEligibility",isAuth,isAdmin,createEligibility)

router.post("/createFeedback",isAuth,isUser,createFeedback)
router.get("/getallFeedback",getallFeedback)

router.post("/addDetails",isAuth,isUser,addDetails)

module.exports = router