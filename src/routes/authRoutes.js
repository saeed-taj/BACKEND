import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';


const router = express.Router();

// Register a new user endpoint (auth/register)
router.post('/register', async (req , res) => {
    const { username , password } = req.body;
    // save the user and an irreversibly encrypted password
    // save saeedtaj00@gmail.com | ,sdnlksnd.dfnklnfd.dnfknf.dldmfl
    // encrypted the password 
    const hashedPassword = bcrypt.hashSync(password , 8);

    // save the new user and the hased password to the db
    try {
        // const insertUser = db.prepare(`INSERT INTO users(username , password)
        //     VALUES(? , ?)`);
        //     const result = insertUser.run(username , hashedPassword);
        
        // This is the prisma code instead of sql code which is above we use the prisma to talk with the database 
        const user = await prisma.User.create({
            data : {
                username,
                password : hashedPassword
            }
        });
// Method	    Meaning
// create()	    INSERT
// findMany()	SELECT
// findUnique()	SELECT WHERE id
// update()	    UPDATE
// delete()	    DELETE

        const defaultTodos = `Hello :) Added your first todo!`;
        
        // const insertTodo = db.prepare(`INSERT INTO todos(user_id , task)
        //     VALUES(? , ?)`);
            
        //     insertTodo.run(result.lastInsertRowid, defaultTodos);

        const todo = await prisma.todo.create({
            data : {
                task : defaultTodos,
                userId : user.id
            }
        });


        // create a token
        const token = jwt.sign(
            {id: user.id}, 
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        );
        res.json({ token });
       
    } 
    catch (error) {
        console.log(error.message);
        res.sendStatus(503);
    }
});

router.post('/login' , async (req , res) => { 
    // we get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's ecrypted, which means that we cannot compare it to one
    // user just used trying to login

    // so what we can to do, is again , one way encrypt the password the user just entered.
    const {username , password} = req.body;

    try {

        const user = await prisma.User.findUnique({
            where : {
                username : username
            }
        });
    //     const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
    //    // This does NOT run the SQL yet.
    //    // It only prepares it — like loading and caching the SQL so it can run fast many times.
    //     const user = getUser.get(username);
       
        // .get(value) executes the prepared statement and returns one row.
        // if we cannot find a user associated with that username just return out of the function 
        
        if(!user){
            return res.status(404).send({message:"user not found"});
        }

        const passwordIsValid = bcrypt.compareSync(password , user.password);

        // if the login password do not matches with the registered password 
        if(!passwordIsValid){
            return res.status(401).send({ message : "Invalid password" })
        };

        
        // when we have a successfull authentication

        // why user.id becasue when we logged in successfully we know that our username and password
        // are are true so we assign that rows id to the id and write id : user.id and send response 
        const token = jwt.sign(
            {id : user.id}, // Payload
            process.env.JWT_SECRET,
            { expiresIn : '24h' }
        );

        res.json({ token });
    }
    catch (error) {
        console.log(error.message);
        res.sendStatus(503);
        // 503 means internal backend down / issue

    }
});

export default router