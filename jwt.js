const jwt = require('jsonwebtoken');
require('dotenv').config()
const key ='ACCESS_TOKEN_SECRET'
const generateToken =(username=>{
    return jwt.sign({username},key,{expiresIn:60*60})
})

const verifyToken=(token)=>{
    try{
        return jwt.verify(token,key)
    }
    catch(_err){
        return false
    }
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      console.log(user)
      req.username = user.name
      next()
    })
  }


module.exports={
    generateToken,
    verifyToken,
    authenticateToken
}