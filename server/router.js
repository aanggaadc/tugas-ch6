const express = require("express")
const router = express.Router()
const client = require('./connection')
const db = client.db("users_list")
const ObjectId = require("mongodb").ObjectId


// API UNTUK MENAMPILKAN KESELERUHAN DATA USER
router.get('/api/user', async (req, res) => {
    try {
        await client.connect()
        const users = await db.collection("users").find().toArray()
        if(users.length > 0){
            res.status(200).json({
                message :"Succsessfully Get Data",
                status: "succsess",
                data : users
            })  
        } 
        else{
            res.status(200).json({
                message: "No User Found",
                status : "succsess",
                data: users
            })
        }        
    } catch (error) {
        res.status(500).json(error)        
    }finally{
        await client.close()
    }
})


//API UNTUK MENAMPILKAN DATA USER BY ID
router.get('/api/user/:id', async (req, res) => {
    try {
        await client.connect()
        const user = await db.collection("users").findOne({_id: ObjectId(req.params.id)})
        if(user){
            res.status(200).json({
                message :"Succsessfully Get Data",
                status: "succsess",
                data : user
            })  
        } 
        else{
            res.status(200).json({
                message: "User Not Found",
                status : "succsess",
                data: user
            })
        }        
    } catch (error) {
        res.status(500).json(error)        
    }finally{
        await client.close()
    }
})

//API UNTUK MENAMBAHKAN DATA
router.post('/api/user', async (req, res) => {
    try {
        await client.connect()
        const newData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password            
        }

        const result = await db.collection("users").insertOne(newData)
        if(result.acknowledged===true) {
            res.status(201).json({
                message: "User Created Succsessfully",
                status: "succsess",
                data: newData
            })

        }else{
            res.status(500).json({
                message: "User Failed to Create",
                status: "fail"
            })
        }
    } catch (error) {
        res.status(500).json(error)        
    }finally{
        await client.close()
    }
})


// API UNTUK EDIT DATA
router.put('/api/user/:id', async (req, res) => {
    try {
        if(!req.params.id){
            res.status(400).json({
                message: "User Failed to Update, Please Insert ID",
                status: "fail"
            })
        }else{
            await client.connect()
        const{name, email, password} = req.body

        const result = await db.collection("users").updateOne(
            {
                _id: ObjectId(req.params.id)
            },
            {
                $set: {
                    name: name,
                    email: email,
                    password: password
                }
            }
        )
        if(result.modifiedCount > 0) {
            res.status(201).json({
                message: "User Updated Succsessfully",
                status: "succsess"
            })
        }else{
            res.status(500).json({
                message: "User Failed to Create",
                status: "fail"
            })
        }
        }        
    } catch (error) {
        res.status(500).json(error)        
    }finally{
        await client.close()
    }
})


//API UNTUK MENGHAPUS DATA USER
router.delete('/api/user/:id', async (req, res) => {
    try {
        if(!req.params.id){
            res.status(400).json({
                message: "User Failed to Delete, Please Insert ID",
                status: "fail"
            })
        }else{
        await client.connect()
        const result = await db.collection("users").deleteOne({_id:ObjectId(req.params.id)})
        if(result.deletedCount > 0) {
            res.status(201).json({
                message: "User Deleted Succsessfully",
                status: "succsess"
            })
        }else{
            res.status(500).json({
                message: "User Failed to Delete",
                status: "fail"
            })
        }
        }        
    } catch (error) {
        res.status(500).json({message: error.message})        
    }finally{
        await client.close()
    }
})


module.exports = router