var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/booklist', function(req, res) {
  //var dbBook = require("../dbBooks");
  //var Books = dbBook.jsonContent;

});

module.exports = router;
