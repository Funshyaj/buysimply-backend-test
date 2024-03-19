const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
const jwt = require('jsonwebtoken');

const fs = require('fs');

const loansData = JSON.parse(fs.readFileSync('loans.json'));


// Fetch all loans (filtered for staff role)
router.route('/').get((req, res, next) => {
    const token = req.headers['authorization']
    const { status } = req.query;
    if (token) {
        const jwtSecretKey = 'dsfewf2ewfm32unfuekf'
        const user = jwt.verify(token, jwtSecretKey)

        if (!status) {
            const filteredLoans = loansData.map((loan, index) => ({
                // loan['applicant']: 123213
                ...loan,
                // loan.applicant.totalLoan: user.role === 'admin' || user.role === 'superadmin' ? loan.totalLoan : '',
                totalLoan: user.role === 'admin' || user.role === 'superadmin' ? loan.applicant.totalLoan : '',
            }));
            res.json({ loans: filteredLoans });
        }
        else if (!status || !['pending', 'active'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status parameter' });
        } else {
            const filteredLoans = loansData.filter(loan => loan.status === status);
            res.json({ loans: filteredLoans });
        }
    } else {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
});


// Fetch user's loans by email
router.route('/:userEmail/get').get((req, res) => {
    const { userEmail } = req.params;
    console.log(userEmail)
    if (userEmail) {
        const userLoans = loansData.filter(loan => loan.applicant.email === userEmail);
        res.json({ loans: userLoans });
    } else {
        res.json({ loans: 'no loans for this user' });
    }
});

// Fetch expired loans
router.route('/expired').get((req, res) => {
    // const today = new Date().toISOString().slice(0, 10);
    const today = new Date()
    const expiredLoans = loansData.filter(loan => new Date(loan.maturityDate) < today);
    res.json({ loans: expiredLoans });
})

// delete loans
router.route('/:loadId/delete').delete((req, res) => {
    const { loanId } = req.params;
    const loanIndex = loansData.findIndex(loan => loan.id === loanId);
    if (loanIndex !== -1) {
        loansData.splice(loanIndex, 1);
        fs.writeFileSync('loans.json', JSON.stringify(loansData));
        res.json({ message: 'Loan deleted successfully' });
    } else {
        res.status(404).json
    }
})


module.exports = router