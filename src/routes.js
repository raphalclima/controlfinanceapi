import { Router } from 'express'

import AuthMiddleware from './middlewares/AuthMiddleware'
import { UserController, FinanceController, TagController, OriginController } from './controllers/Index'

const routes = Router()

// Public Routes
routes.post('/users', UserController.register)
routes.post('/users/authenticate', UserController.authenticate)
routes.post('/users/forgot_password', UserController.forgotPassword)
routes.post('/users/reset_password', UserController.resetPasword)

// Private Routes
// User Routes
routes.get('/users/:id', AuthMiddleware, UserController.findById)
routes.put('/users/:id', AuthMiddleware, UserController.update)
routes.delete('/users/:id', AuthMiddleware, UserController.destroy)

// Tag Routes
routes.get('/tags/:id', AuthMiddleware, TagController.index)
routes.post('/tags', AuthMiddleware, TagController.register)
routes.put('/tags/:id', AuthMiddleware, TagController.update)
routes.delete('/tags/:id', AuthMiddleware, TagController.destroy)

// Origin Routes
routes.get('/origins/:id', AuthMiddleware, OriginController.index)
routes.post('/origins', AuthMiddleware, OriginController.register)
routes.put('/origins/:id', AuthMiddleware, OriginController.update)
routes.delete('/origins/:id', AuthMiddleware, OriginController.destroy)

// Finance Routes
routes.get('/finances/:id', AuthMiddleware, FinanceController.index)
routes.post('/finances', AuthMiddleware, FinanceController.register)
routes.put('/finances/:id', AuthMiddleware, FinanceController.update)
routes.delete('./finances/:id', AuthMiddleware, FinanceController.destroy)

export default routes
