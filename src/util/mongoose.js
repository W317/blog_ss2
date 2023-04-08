export function multipleMongooseToObject(mongooses) {
    if (!Array.isArray(mongooses)) {
      return [];
    }
    
    return mongooses.map(mongoose => mongoose.toObject());
  }
  
export function mongooseToObject(mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
}
