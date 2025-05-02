const mongoose = require('mongoose');
const Community = require('./src/models/community.model');  // Correct path to your model

const mongoOptions = {
  serverSelectionTimeoutMS: 30000,  // 30 seconds timeout for server selection
  socketTimeoutMS: 45000,  // 45 seconds for socket timeout
};

mongoose.connect('your_mongo_db_connection_string', mongoOptions)
  .then(() => {
    console.log('MongoDB connected for cleanup');

    // Proceed with the deletion of all communities
    return Community.deleteMany({});
  })
  .then((result) => {
    console.log(`${result.deletedCount} communities deleted.`);
    mongoose.connection.close();  // Close the connection after the operation
  })
  .catch((err) => {
    console.error('Error deleting communities:', err);
    mongoose.connection.close();  // Close the connection on error
  });
