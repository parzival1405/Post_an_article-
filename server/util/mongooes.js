export const mutipleMongooseToObject= (mongooseArray) => {
         mongooseArray.map(mongooseArray => mongooseArray.toObject());
    }
export const  MongooseToObject = (mongoose) => {
         mongoose ? mongoose.toObject() : mongoose;
    }