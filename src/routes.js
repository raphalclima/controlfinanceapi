import { Router } from 'express'

import AuthMiddleware from './middlewares/AuthMiddleware'
import UserController from './controllers/UserController'
import TagController from './controllers/TagController'
import OriginController from './controllers/OriginController'

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
routes.get('/origin/:id', AuthMiddleware, OriginController.index)
routes.post('/origin', AuthMiddleware, OriginController.register)
routes.put('/origin/:id', AuthMiddleware, OriginController.update)
routes.delete('/origin/:id', AuthMiddleware, OriginController.destroy)

export default routes
