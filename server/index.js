const express = require("express")
const app = express() 

require("dotenv").config()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")

const dbConnect = require("./config/database")

const { cloudinaryConnect } = require("./config/cloudinary")

const routes = require("./routes/routes")

// Always use port 3000 for backend
const PORT = process.env.PORT ||  4000;

dbConnect()
cloudinaryConnect()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'https://xyz-frontend-c8uq.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}))

app.use("/api",routes)

app.listen(PORT, () => {
  console.log(`Backend Server started at PORT ${PORT}`)
})
