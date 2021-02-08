const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readFile('users.json', (err, data) => {
      let users = JSON.parse(data).users
      res.render('index', {users: users}) 
  })
})

app.get('/add', (req,res) => {
  res.render('add');
})


app.post('/createUser', (req, res) => {
    let user = {};
    // console.log(req.body)
    user.username = req.body.username;
    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;

    fs.readFile('users.json', (err, data) => {
      var users = JSON.parse(data).users
      users.push(user)
      fs.writeFile('users.json', JSON.stringify({users: users}), err => {
          if (err) throw err
      })
  })
  res.redirect("/") 
})

app.get('/edit/:id', (req, res) => {
  fs.readFile('users.json', (err, data) => {
      let name = req.params.id.substr(3)
      let user = JSON.parse(data).users.find(u => u.username === name);
      console.log(req.params.id)
      console.log(user)
      let index = JSON.parse(data).users.findIndex(u => u.username === name)
      res.render('edit', {user: user, index: index})
  })
})

app.post('/edit/:id', (req, res) => {
  let index = Number(req.params.id.substr(3));
  console.log(req.body)
  fs.readFile('users.json', (err, data) => {
      let users = JSON.parse(data).users
      let user = {
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          age: req.body.age
      }
      users[index] = user
      fs.writeFile('users.json', JSON.stringify({users: users}), err => {
          if (err) throw err
      })
      res.redirect('/')
  })
})

app.post('/delete/:id', (req, res) => {
  let index = Number(req.params.id.substr(3));
  fs.readFile('users.json', (err, data) => {
      let users = JSON.parse(data).users
      users.splice(index, 1)
      fs.writeFile('users.json', JSON.stringify({users: users}), err => {
          if (err) throw err
      })
      res.redirect('/')
  })
})


app.listen(3000, () => {
    console.log("Listening on port 3000.");
})
