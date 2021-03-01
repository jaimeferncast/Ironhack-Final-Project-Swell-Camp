// DB connection
const mongoose = require("mongoose");
const dbName = "surfschool";
mongoose.connect(`mongodb://localhost/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Seed here!
const Bed = require("../models/bed.model");

const beds = [
  {
    code: "cactus-1-1"
  },
  {
    code: "cactus-1-2"
  },
  {
    code: "cactus-2-1"
  },
  {
    code: "cactus-2-2"
  },
  {
    code: "cactus-3-1"
  },
  {
    code: "cactus-3-2"
  },
  {
    code: "cactus-5-1"
  },
  {
    code: "cactus-5-2"
  },
  {
    code: "cactus-5-3"
  },
  {
    code: "cactus-6-1"
  },
  {
    code: "cactus-6-2"
  },
  {
    code: "cactus-7-1"
  },
  {
    code: "cactus-7-2"
  },
  {
    code: "cactus-8-1"
  },
  {
    code: "cactus-8-2"
  },
  {
    code: "cactus-9-1"
  },
  {
    code: "cactus-10-1"
  },
  {
    code: "cactus-10-2"
  },
  {
    code: "cactus-10-3"
  },
  {
    code: "cactus-11-1"
  },
  {
    code: "cactus-11-2"
  },
  {
    code: "cactus-12-1"
  },
  {
    code: "cactus-12-2"
  },
  {
    code: "cactus-13-1"
  },
  {
    code: "cactus-13-2"
  },
  {
    code: "cactus-14-1"
  },
  {
    code: "cactus-14-2"
  },
  {
    code: "bahamas-1"
  },
  {
    code: "bahamas-2"
  },
  {
    code: "bahamas-3"
  },
  {
    code: "bahamas-4"
  },
  {
    code: "bahamas-5"
  },
  {
    code: "bahamas-6"
  },
  {
    code: "bahamas-7"
  },
  {
    code: "bahamas-8"
  },
  {
    code: "bahamas-9"
  },
  {
    code: "bahamas-10"
  },
  {
    code: "bahamas-11"
  },
  {
    code: "bahamas-12"
  },
  {
    code: "long-1"
  },
  {
    code: "long-2"
  },
  {
    code: "long-3"
  },
  {
    code: "long-4"
  },
  {
    code: "mentawai-1"
  },
  {
    code: "mentawai-2"
  },
  {
    code: "mentawai-3"
  },
  {
    code: "mentawai-4"
  },
  {
    code: "mentawai-5"
  },
  {
    code: "wau-1"
  },
  {
    code: "wau-2"
  },
  {
    code: "wau-3"
  },
  {
    code: "wau-4"
  },
  {
    code: "wau-5"
  },
  {
    code: "flowit-1"
  },
  {
    code: "flowit-2"
  },
  {
    code: "flowit-3"
  },
  {
    code: "flowit-4"
  },
  {
    code: "flowit-5"
  },
  {
    code: "flowit-6"
  }
];

Bed.create(beds)
  .then(() => mongoose.connection.close())
  .catch((err) => console.error(`Following error occured: \n ${err}`));
