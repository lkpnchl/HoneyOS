const { contextBridge } = require("electron")
const usersDB = require("../models/userModel")
const setupFileManagementRoutes = require("../models/test")

contextBridge.exposeInMainWorld("sqlite", {
  usersDB,
})

contextBridge.exposeInMainWorld("express", {
  setupFileManagementRoutes,
})
