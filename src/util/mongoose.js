export function multipleMongooseToObject(mongooses) {
  if (!Array.isArray(mongooses)) {
    return [];
  }

  return mongooses.map((mongoose) => mongoose.toObject());
}

// if converts one mongoose.Document to Plain Javascript Object.
// using await + lean()
