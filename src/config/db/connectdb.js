import mongoose from "mongoose"


export default function connect() {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect('mongodb://127.0.0.1/blog_ss2',
            { useNewUrlParser: true });
        console.log("connect dbs successfully")
    } catch (error) {
        console.log('xonnect dbs fail')
    }
}

