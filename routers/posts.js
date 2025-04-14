const express = require('express');
const router = express.Router();
const postsControllers = require("../controllers/postsControllers")



//index
router.get('/', postsControllers.index);

//show
router.get('/:slug', postsControllers.show);

//create
router.post('/', postsControllers.create)

//update
router.put('/:slug', postsControllers.update)

//modify
router.patch('/:slug', postsControllers.modify)

//destroy
router.delete('/:slug', postsControllers.destroy)

module.exports = router;