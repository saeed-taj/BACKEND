import jwt from 'jsonwebtoken';

function middleWare(req , res , next){

    // i will name it authHeader because it has Bearer with it 
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).json({ message : "No token provided" })
    }

    const token = authHeader.split(' ')[1];
    // "Hello World".split(' ')
    // ["Hello", "World"]
    // [0] → "Bearer"
    // [1] → the actual JWT

    if(!token){
        return res.status(401).json({message : "invalid token format"})
    }

    // so i am learning github aactions

//     does two things:

// Checks if the token is valid
// (Correct signature? Not expired?)

// If valid then returns the payload in “decoded”

// So “decoded” is NOT coming from our code.
// It is coming from the token itself.

// Whatever you put inside jwt.sign() at login
// comes out in decoded.

    jwt.verify(token , process.env.Jwt_SECRET , (error , decoded) => {
        if (error) {
           return res.status(401).json({ message : "Error has been occured" })
        }
        // req is just a normal JavaScript object we know
        // so we  can add new properties to it anytime
        // Create a new property called userid on the req object and store decoded.id inside it
        req.userid = decoded.id;
        // this decoded.id 
        next();
    });
};

// It came from here:

// jwt.sign({ id: user.id }, SECRET)

// You inserted id into the token.

// JWT just stores whatever you put inside.

// Example:

// If you wrote:

// jwt.sign({ username: "saeed" }, SECRET)

// Then:

// decoded.username

// would exist.

// NOT decoded.id.

export default middleWare

// so what we did was like we initially got a user name and a password then we checked them and if
// matched we assigned that user an id and provided token(jwt) then when this user wants to get 
// his/her todos we send that affiliated token to the backend in the middle ware we checked the 
// token is matched not tampered or something like that then we with the req came here in middle 
// we added user with req object like this req.userid = decoded.id because i wanna use userid
// in the todoroutes all over the code so to avoid write multiple times there i just added userid
// with the req so i can easily access it there