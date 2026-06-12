
import { PrismaClient } from '@prisma/client';
// Think of PrismaClient as a class (blueprint).
// It knows:
// how to connect to your DB
// what models you have (User, Todo, etc.)
// how to run queries
// But by itself, a class does nothing.
// In JavaScript:
// class = blueprint
// new = create a real object from that blueprint
   
const prisma =  new PrismaClient();

export default prisma;

