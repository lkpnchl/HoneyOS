const { contextBridge } = require("electron")
const usersDB = require("../models/userModel")

contextBridge.exposeInMainWorld("sqlite", {
  usersDB,
})
