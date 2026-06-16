import {prisma} from "../lib/prisma.js";

const connectDb = async () =>{
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

export {prisma, connectDb};