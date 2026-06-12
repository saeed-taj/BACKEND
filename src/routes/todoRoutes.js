import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// get all todos for logged-in user

router.get('/' ,  async (req , res) => {
    

    const todos = await prisma.Todo.findMany({
        where : {
            userid : req.userid
        }

        //,
        // select : {
        //     task : true ,
        //     completed : true
        // } we can also do this select to select specific columns
    });

    // const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
    // const todos = getTodos.all(req.userid);


    //     req.userid comes from the middleware, NOT from the frontend. 
// You are using the middleware value that was added after JWT verification
    res.json(todos);
});

// Prisma automatically converts this into SQL like:

// const todos = await prisma.Todo.findMany({
//         where : {
//             userid : req.userid
//         }
//     });
// SELECT * FROM Todo

// WHERE userid = req.userid;

// So Prisma is basically doing:

// SELECT *

// That means:

// ✔ id
// ✔ task
// ✔ completed
// ✔ userid

// All columns are returned.

// create a new todo 
router.post('/' , async (req , res) => {

    const { task } = req.body;


    const result = await prisma.Todo.create({
        data : {
            userid : req.userid,
            task
        }
    })
    // const insertIntoDb = db.prepare(`INSERT INTO todos (user_id , task) VALUES( ? , ?)`);
    // const result = insertIntoDb.run(req.userid , task);
     
    res.json(result)
    // res.json({id : result.lastInsertRowid , task , completed : 0})
});

// update a todo
router.put('/:id', async (req , res) => {
    //  '/:id' : "This route expects an ID inside the URL."

    // Why Not Use req.body Instead?
    // Because ID belongs in the URL, not body.

    const { id } = req.params;
    
    const {task , completed } = req.body;


    const updated = await prisma.Todo.update({
        where : {
            id  : parseInt(id), // this id is todos table's id 
            userid : req.userid,
        },
        data : {
            task : task,
            completed : !!completed // converts to boolean expression
        }
    });
    
    // const updated = db.prepare(`UPDATE todos SET task = ? WHERE = ? `);
    // updated.run(completed , id);

    res.json( {  message  : " Todo completed " } );

});

router.delete('/:id', async (req , res) => {

    const { id } = req.params; 
    const userId = req.userid

    // this id comes with the URL like in frontend:apiBase+'todos'+'/'+index 
    // so this index is id we got here in backend

    const deleteTodo = await prisma.Todo.delete({
        where : {
            id : parseInt(id),
            userid : userId
        }
    }); // deletes the whole row 

    // const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ? `);
    // deleteTodo.run(id , userId);

    res.json({
        deleteTodo, 
        message : "Todo has been deleted"})

});

export default router
// CRUD : PGPD


// result.lastInsertRowid
// Example Without Sending ID 

// Backend returns:

// {
//   "task": "Study AI",
//   "completed": 0
// }

// Frontend list:

// Study AI
// Sleep
// Eat

// Now user clicks Delete "Study AI"

// Frontend tries:

// DELETE /todos/???

// But which todo?

// Frontend doesn't know the ID.

// Problem 