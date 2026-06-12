import express from 'express';
import path , { dirname } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.ts';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleWare from './middleware/authMiddleware.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5003;

// get the file path from the current module
const __fileName = fileURLToPath(import.meta.url);

// get the directory name from the path
const __dirName = dirname(__fileName);
 
// app.use() like installing a filter on all incoming requests. Imagine a security guard at your office building.
// For every request coming into the server, convert the JSON body into a JavaScript object.


// serves the HTML file from the /public directory
// Tells express to serve all files from public folder as static assets /
// file. Any requests for the css  files will be resolved to the public direcotory
// path.join() is a Node.js function. Its job = Combine folder paths safely.
app.use(express.static(path.join(__dirName, '../public')));

// serving up the HTML file from the /public directory
app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirName , 'public' , 'index.html'));
});

app.use('/auth' , authRoutes); //  / = base_API + auth and in frontend that fetch(apiBase + '  auth /register'
app.use('/todos' , authMiddleWare , todoRoutes);

app.use(express.static("public"));

app.listen(PORT , () => {
    console.log(`server started to listening to the port : ${PORT}`);
});


// Frontend: Sends a request to /auth/register.
// app.js (The City): The line app.use('/auth', authRoutes) 
// acts like a filter. It says, "If a request starts with /auth, chop that part off and
//  send the remainder into the authRoutes file".
// auth.routes.js (The Street): Inside this file, the router only sees the leftover part: /register. 
// Since you have router.post('/register', ...), it sees a perfect match and runs your function.