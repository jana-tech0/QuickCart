import mongoose from 'mongoose';

const MONGO_URL = "mongodb+srv://janatalari4:Jana_119@cluster0.ornpg.mongodb.net/proshop?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection Error: ", error);
        process.exit(1);
    }
};

export default connectDB; 