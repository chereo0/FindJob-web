const { default: mongoose } = require("mongoose");
// import a databse that linked in the mongodb

const connectToDB = async () => {
  const connectionURL =
    "mongodb+srv://abdelrhmanelanani20:navas5atir@cluster0.b0bqwac.mongodb.net/";
  mongoose
    .connect(connectionURL)
    .then(() => console.log("jon board database connection is successfull"))
    .catch((error) => console.log(error));
};

export default connectToDB;
