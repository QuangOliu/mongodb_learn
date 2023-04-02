const { MongoClient } = require('mongodb')

let dbConnection
const url = "mongodb+srv://quangoliu:Kualg2kll@cluster0.jatzl.mongodb.net/?retryWrites=true&w=majority"

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(url)
      .then(client => {
        dbConnection = client.db()
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}