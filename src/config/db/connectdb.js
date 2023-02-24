import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connect = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://MinhHieu:cuunhatnhat2811@cluster0.751vqph.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connect;
