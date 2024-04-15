const { contextBridge } = require("electron")
const usersDB = require("../models/test")
const setupFileManagementRoutes = require("../models/userModel")

contextBridge.exposeInMainWorld("sqlite", {
  usersDB,
})

contextBridge.exposeInMainWorld("express", {
  setupFileManagementRoutes,
})
