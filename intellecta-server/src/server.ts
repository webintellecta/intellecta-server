
import app from './app'
import dotenv from 'dotenv'
import connectDb from './config/db'


dotenv.config()
const PORT = Number(process.env.PORT)  || 5001

connectDb()


app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});





