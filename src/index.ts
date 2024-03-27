import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://ramanmehta:rmnrck@cluster0.disswhq.mongodb.net/assgn_db'; // Replace with your MongoDB URI

const connectToMongoDB = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(mongoURI, {});
    console.log('MongoDB Connection Successful');
  } catch (err) {
    console.log(err);
  }
};

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
