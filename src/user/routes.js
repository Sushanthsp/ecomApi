const { Router } = require('express');
const controller = require('./controller')
var fetchuser = require("../../middleWare/fetchUser");

const router = Router();

router.get('/user',controller.getUsers )
router.post('/user',controller.addUser )
router.get('/user/:id',controller.getUsersById )
router.delete('/user/:id',fetchuser,controller.removeUserByName )
router.put('/user/:id',controller.updateUserById )
router.post('/user/login',controller.login)


router.get('/products',fetchuser,controller.getProducts)
router.get('/products/:id',fetchuser,controller.getProductsById)
router.post('/products',fetchuser,controller.createProducts)
router.put('/products/readyforlisting/:id',fetchuser,controller.pdtToReadyForListing)
router.put('/products/activeInactive/:id',fetchuser,controller.pdtToActiveAndInactive)
router.put('/products/update/:id',fetchuser,controller.updateProducts)
router.delete('/products/delete/:id',fetchuser,controller.deleteProducts)

router.get('/orders',fetchuser,controller.getOrders)
router.get('/orders/:id',fetchuser,controller.getOrdersById)
router.put('/orders/:id',fetchuser,controller.updateOrdersById)

module.exports = router;