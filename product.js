
const pd = require("./db/core");



const addproduct = async(add_product) =>{

    productData={
        product_name: add_product.product_name,
        price:add_product.price,
        quantitiy:add_product.quantitiy,
        category:add_product.category,
        product_description:add_product.product_description,
        product_image:add_product.product_image
    }

    let product = await pd.insertData("product", productData);
    console.log("product added successfully1")
    return{data:"Added Successfully"}
}



const listproducts = async() =>{

let listofproducts = await pd.selectSortedData('product' , {sortingcondition:['prdct_id','desc'],fields: [], filteringConditions: []});


return listofproducts.map(product=>{
    return {...product,product_image:JSON.parse(product.product_image)}
})
}


const searchproducts = async(data) =>{
  

       let searchdata = await pd.selectData('product', {
           filteringConditions: [
               ['product_name', 'LIKE', "%"+data+"%"]
            
           ]
       })
       // console.log(searchdata);
      return searchdata
    
    
}







const showproducts = async(product_id) =>{
  

       let product = await pd.selectData('product', {
           filteringConditions: [
               ['product_id', '=', product_id]]
       })
       if (product.length){
        return product[0];
       }
       return {}
       
    
        
        return{data:"product not found"}
    
    
}





const delete_product = async(id) =>{
    const result = await pd.deleteData('product',{
        filteringConditions:[
            ['prdct_id',"=",id]
        ]
    })
    return{data:"Deleted Successfully"}
}



module.exports ={addproduct, listproducts , showproducts, searchproducts , delete_product}