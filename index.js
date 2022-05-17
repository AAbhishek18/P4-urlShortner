
const express = require('express');
const bodyParser = require('body-Parser');
const route = require('./src/routes/route')
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://AAbhishek2022:1ESrG6kzyaqzUE3p@cluster0.am17a.mongodb.net/Project-4-group95Database", {
    useNewUrlParser: true
})

    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))



app.use('/', route);
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port' + (process.env.PORT || 3000))
});