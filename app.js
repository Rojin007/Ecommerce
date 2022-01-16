var express=require('express')
var app=express();
const validator = require('email-validator')
const port=5000;
const db = require("./db/core")
const jt=require("jsonwebtoken")
const short=require('short-uuid')
const product=require("./product")
const orders=require("./order")
const crypto=require("crypto")
const fileUpload = require('express-fileupload')
const {sendOtp} = require("./otp")
const {
    generateHash,
    verifyPassword
  } = require("./hp")
  const { generateToken,verifyToken,authenticateToken} = require('./jwt')
const cors=require("cors");
const shortUUID = require('short-uuid');
app.use(cors())
app.use(express.json());
app.use(fileUpload())
app.use("/images", express.static("images"))

const authentication = (req,res,next)=>{
    if(!verifyToken(req.headers.authorization)){
      res.sendStatus(401);
      return;
    }
    next();
  }
app.post('/api/v1/signup',async(req,res)=>{
    const{name,username,email,phone,password}=req.body
    if(!name || !username || !email || phone.length !== 10 || !Number(phone)){
        res.send({status:false, data: "Required Fields are empty"})
        return
      }
    
      if(!validator.validate(email)){
        res.send({status:false, data: "Invalid Email Address!"})
        return
      }
      const existingUser = await db.selectData('users', {
        filteringConditions: [
            ['username', '=', username],
        ]
      })
    
      if(existingUser.length){
        res.send({status:false, data: "User Already Exists"})
        return
      }
    
      const existingPhone = await db.selectData('users', {
        filteringConditions: [
            ['phone', '=', phone],
        ]
      })
      if(existingPhone.length){
        res.send({status:false, data: "Phone Number Already Exists"})
        return
      }
    
      const hashedPassword = await generateHash(password)
      const insertedId = await db.insertData("users", {
        name,
        username,
        email,
        phone,
        password: hashedPassword
      })
      if(!insertedId){
        res.send({status:false , data: "failed to add user" })
        return
        }
    
        const otpResponse = await sendOtp(phone)
        if(!otpResponse.status){
          res.send({status:false, data:"failed to send otp"})
          return
        }
        const insertedOtpId = await db.insertData("otp", {
          otp: otpResponse.otp,
          phone
        })
        if(!insertedOtpId){
          res.send({status:false , data: "failed to add user" })
          return
          }
        console.log(otpResponse.status);
        res.send({status:true, data:"Sign Up success"})
    

})
app.post("/api/v1/signup/otp-verification", async(req, res) => {
    const {phone, otp} = req.body
    const otpData = await db.selectData('otp', {
      fields: [],
      filteringConditions: [
          ['phone', '=', phone],
      ]
    })
    if(!otpData.length){
      res.send({status: false, data:"otp doesn't exist"})
      return
    }
    console.log(otpData[otpData.length - 1].otp, otp)
    if(otpData[otpData.length-1].otp != otp){
      res.send({status: false, data: "Wrong Otp"})
      return
    }
    await db.updateData("users",
     { fields: {
       status: true
     },filteringConditions: [
       ["phone","=",phone]
     ] }
    )
      res.send({status: true, data:"otp verified"})
      
   
   
   })
app.get('/api/v1/signin',async(req,res)=>{
   
    const{ username,pass} = req.body
    
    const user={name:username}
    const accessToken =jt.sign(user,process.env.ACCESS_TOKEN_SECRET)

    

        let usercheck = await db.selectData('users', {
            filteringConditions: [
                ['username', '=', username]
                
            ]
        }) 
        
            if (!usercheck.length){
                console.log("no users found");
                return {status:false,
                        data:"no users"};
                        
            }
            if(!usercheck[0].status){
                res.send({status: false, data: "Account is not activated"})
              return
            }
            

            const passwordMatch = await verifyPassword(pass,usercheck[0].password)
                if(!passwordMatch){
                 res.send({status: false, data: "wrong password"})
                 return
                }   
                //console.log("login success")
               res.send({accessToken : accessToken, id:usercheck[0].id ,data:"login success"})
                    
                    
            })
            app.post('/api/v1/forgotpassword', async(req,res)=>{
                
                  const {phone} =req.body
                 
   
                    let usercheck = await db.selectData('users', {
                      filteringConditions: [
                          ['phone', '=', phone]
                      ]
                      })
                      console.log(sendOtp)
                      const otpResponse = await sendOtp(phone)
                      const insertedOtpId = await db.insertData("otp", {
                        otp: otpResponse.otp,
                        phone
                      })
                     if(!usercheck.length){
                       return{satus:false,
                        data:"no user phn exist"}
                     }
                     else{
                     res.send({status:true,data:"user exist"})}
                     if(!otpResponse.status){
                      return({status:false, data:"failed to send otp"})
                      
                    }
                   
                  
                
              })
              app.post('/api/v1/forgotpassword/otpverification', async(req,res)=>{

                const {phone, otp} = req.body
                  const otpData = await db.selectData('otp', {
                    fields: [],
                    filteringConditions: [
                        ['phone', '=', phone],
                    ]
                  })
                  if(!otpData.length){
                    res.send({status: false, data:"otp doesn't exist"})
                    return
                  }
                  console.log(otpData[otpData.length - 1].otp, otp)
                  if(otpData[otpData.length-1].otp != otp){
                    res.send({status: false, data: "Wrong Otp"})
                    return
                  }
                  
                  
                    res.send({status: true, data:"otp verified",token:generateToken(phone)})     
              }  )
              app.post("/api/v1/forgotpassword/password-reset",authentication,async(req,res)=>{
                const{phone,password} = req.body;
                const hashedPassword = await generateHash(password);
              
              await db.updateData("users",
                { fields: {
                  password: hashedPassword
                }, filteringConditions: [
                    ["phone","=",phone]
                  ] 
                }
              );
              
              res.send({status: true, data: " Password updated successfully!"})})
               
              app.post('/api/v1/upload', function(req, res) {
  

                if (!req.files || Object.keys(req.files).length === 0) {
                  return res.status(400).send('No files were uploaded.');
                }
                 const {image} = req.files
                const uploadPath = '/images/' + short.generate()+".jpg"
                image.mv( __dirname +uploadPath, (err)=> {
                  if (err)
                    return res.status(500).send(err);
              
                  res.send({status: true, data: {url:uploadPath}});
                 });
              })
              app.post('/api/v1/update_username',authenticateToken, async(req,res) => {
                const data  = {username: req.body.username, usrname:req.username} 
                let result = await db.updateData('users',{
                    fields:{
                        username:data.username
                    },
                    filteringConditions:[
                        ['username', '=',data.usrname]
                    ]
                })
                
                res.send("updated successfully")
                })
            
            app.post('/api/v1/update_emailid',authenticateToken, async(req,res) => {
                const data = {email:req.body.email, username:req.username}  
                let result = await db.updateData('users',{
                    fields:{
                        email:data.email
                    },
                    filteringConditions:[
                        ['username', '=',data.username]
                    ]
                })
                                                    
                res.send( "Updated Succesfully")                                                             
                })
            
            app.post('/api/v1/update_phone',authenticateToken, async(req,res) => {
                const data = {phone:req.body.phone, username:req.username}  
                let result = await db.updateData('users',{
                    fields:{
                        phone:data.phone
                    },
                    filteringConditions:[
                        ['username', '=',data.username]
                    ]
                })
                   
                res.send("Updated Succesfully")
                })
                app.post('/api/v1/upload_form', authenticateToken,async(req,res) => {
                    const add_product = req.body
                    let fileNames=[]
                   
                    Object.entries(req.files).forEach(element => {
                        console.log(element)
                        let randomValue = crypto.randomUUID()
                        fileNames.push(randomValue +".jpg")
               
                        req.files[element[0]].mv("./images/"+randomValue+".jpg").then((error)=>{
                              console.log(error)})
                    });
                 
                    add_product.product_image = JSON.stringify(fileNames);
                   const result = await product.addproduct(add_product)
                   res.send(result) 
                   
                   })
                   app.post('/api/v1/searchproducts',authenticateToken, async(req,res) => {
                    const data = req.body.product_name                         
                    
                    const result = await product.searchproducts(data);
                    res.send(result)
                })
            
app.get('/api/v1/featured_products', async (req,res) => {
    const result = await product.listproducts()
    res.send(result)

})
app.post('/api/v1/delete_product', authenticateToken,async(req,res) => {
    const id = req.body.id
    
  
   const result = await product.delete_product(id)
   res.send(result) 
   
   })
      
app.post('/api/v1/add_order', authenticateToken,async(req,res) => {
    const add_order = req.body
    
  
   const result = await orders.addorder(add_order)
   res.send(result) 
   
   })
   app.post('/api/v1/delete_order', authenticateToken,async(req,res) => {
    const id = req.body.id
    
  
   const result = await orders.delete_order(id)
   res.send(result) 
   
   })
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })
    