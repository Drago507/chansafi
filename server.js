const express = require('express');
const jalaliMoment = require('jalali-moment');
const app = express();
const mullahs = require('./mullahs.json');
const people = require('./people.json');
app.set('view engine', 'pug');
// serve static files from the `public` folder
app.use(express.static(__dirname + '/public'));
const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'چن صافی؟',
        subtitle : ' مشاهیر اگه به اندازه آخوندها عمر میکردن تا کی زنده بودن',
        mullahs: mullahs.profiles
    });
});

app.get('/profile', (req, res) => {
    const mullah = mullahs.profiles.find(p => p.id === req.query.id);
    let somemap = people.profiles.map(person => {console.log(person.death); return person.name + " تا سال " + calculate(mullah.birth,person.birth) + " زنده بود (سال فوت :" + jalaliMoment(person.death).locale("fa").format("YYYY") + ")." });
    res.render('profile', {
        title: `About ${mullah.firstname} ${mullah.lastname}`,
        mullah,
        mullahBirthDate : jalaliMoment(mullah.birth).locale("fa").format("YYYY"),
        somemap
    });
});


function calculate(mullahsBirth , personsBirth){
    let personBirthMoment = jalaliMoment(personsBirth,"YYYY-MM-DD");
    let mullahsAge = jalaliMoment().diff(mullahsBirth, 'years');
    return jalaliMoment(personBirthMoment).add(mullahsAge,"years").locale("fa").format("YYYY");
}