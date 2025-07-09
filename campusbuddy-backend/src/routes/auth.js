const express=require('express');
const router=express.Router();
const {register,login}=require('../controllers/authControllers');

router.post('/register',register);
router.post('/login',login);

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello user ${req.user}, you are authenticated!` });
});


module.exports=router;