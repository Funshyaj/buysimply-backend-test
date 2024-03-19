const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const staffData = JSON.parse(fs.readFileSync('staffs.json'));


router.route('/login').post(async (req, res) => {
    const { email, password } = req.body;
    const user = staffData.filter((staff) => staff.email == email)[0]
    if (user && (password === user.password)) {
        const jwtSecretKey = 'dsfewf2ewfm32unfuekf'
        const token = jwt.sign(user, jwtSecretKey)
        res.json({ token })
    } else {
        res.json({
            error: 'incorrect username or password'
        })
    }
})

router.route('/logout').post((req, res) => {
    //
})


module.exports = router