import { Router } from 'express'

import AuthMiddleware from './middlewares/AuthMiddleware'
import UserController from './controllers/UserController'

const routes = Router()

// Public Routes
routes.post('/users', UserController.register)
routes.post('/users/authenticate', UserController.authenticate)
routes.post('/users/forgot_password', UserController.forgotPassword)
routes.post('/users/reset_password', UserController.resetPasword)

// User Routes
routes.get('/users/:id', AuthMiddleware, UserController.findById)
routes.put('/users/:id', AuthMiddleware, UserController.update)
routes.delete('/users/:id', AuthMiddleware, UserController.destroy)

export default routes
