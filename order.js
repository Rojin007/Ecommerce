const pd = require("./db/core");



const addorder = async(add_order) =>{

    productData={
        username:add_order.username,
        product_name: add_order.product_name,
        price:add_order.price,
        quantity:add_order.quantity,
        category:add_order.category,
        phone:add_order.phone,
        product_description:add_order.product_description,
        phone:add_order.phone
       
    }

    let orders = await pd.insertData("orders", productData);
    console.log("product added successfully1")
    return{data:"Added Successfully"}
}

const delete_order = async(id) =>{
    const result = await pd.deleteData('orders',{
        filteringConditions:[
            ['id',"=",id]
        ]
    })
    return{data:"Deleted Successfully"}
}



module.exports ={addorder , delete_order}