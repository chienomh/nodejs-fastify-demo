import mongoose from "mongoose";

const connect = (uri: string)=>mongoose.connect(uri)

export default connect