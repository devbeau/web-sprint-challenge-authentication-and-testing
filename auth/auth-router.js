const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const Users = require('../users/usersModel');

router.post('/register', (req, res) => {
  // implement registration
  const creds = req.body;

  const rounds = Number(process.env.HASH_ROUNDS) || 6);
  const hash = bcryptjs.hashSync(creds.password, rounds);

  creds.password = hash;

  Users.add(creds)
    .then(user => {
      res.status(200).json({data: user});
    })
    .catch(err => {
      res.status(500).json({message: err.message});
    })
});

router.post('/login', (req, res) => {
  // implement login
  const creds = req.body;

  Users.findBy({username: creds.username})
    .then(users => {
      const user = users[0];

      if (user && bcryptjs.compareSync(creds.password, user.password)){
        req.session.username = user.username;

        res.status(200).json({
          message: 'welcome',
          username: req.username
        });
      } else {
        res.status(401).json({message: 'Invalid Credentials'})
      }
    })
    .catch(err => res.status(500).json({message: 'Invalid Credentials'}));
});

module.exports = router;
