const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth')
const loanRoute = require('./routes/loan')

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Connected to port ' + port)
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/auth', authRoute)
app.use('/loans', loanRoute)


app.use((err, req, res, next) => {
    console.error(err)
})