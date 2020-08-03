const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
const urlDB = require('../../db.json');

const cert = require('../../nodejs-contacts-cert.json')

admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: urlDB.url
});

const db = admin.database();

// === GET LIST OF CONTACTS === //
router.get('/', (req, res) => {
    db.ref('contacts').once('value', (snapshot) => {
        const data = snapshot.val();
        res.render('index', { contacts: data});
    })
    
})

// === ADD NEW CONTACT === //
router.post('/add-contact', (req, res) => {
    const contact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mail: req.body.mail,
        phone: req.body.phone
    };
    db.ref('contacts').push(contact);
    res.redirect('/');
});

// === REMOVE CONTACT === //
router.get('/remove-contact', (req, res) => {
    let key = req.query.key;
    db.ref(`contacts/${key}`).remove();
    res.redirect('/');
});


// === UPDATE CONTACT === //
router.post('/update-contact', (req, res) => {
    var request = req.body;
    var key = request.key;
    var mydata = {
        firstname: request.firstname,
        lastname: request.lastname,
        mail: request.mail,
        phone: request.phone
    }

    var query = db.ref('contacts');
    query.child(key).update({
        "firstname": mydata.firstname,
        "lastname": mydata.lastname,
        "mail": mydata.mail,
        "phone": mydata.phone
    })
    res.redirect('/');
});

module.exports = router;