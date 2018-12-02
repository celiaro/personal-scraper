const express = require('express');
const app = express();
const cors = require('cors');
const Nightmare = require('nightmare');

const port = 3000;

app.use(cors());

// first endpoint - already built
app.get('/', (req, res) => {
  res.send("This is my personal web scraper!");
});

// scraper endpoint

app.listen(port, () => {
  console.log(`app running on ${port}`);
});

app.get('/movies/:keyword', (req, res) => {
  var keyword = req.params.keyword;

  function findMovieCover(keyword) {
    var nightmare = Nightmare({ show: true });

    return nightmare
      .goto('https://www.google.com')
      .insert('input[title="Search"]', `movies ${keyword}`)
      .click('input[value="Google Search"]')
      .wait('.rISBZc.M4dUYb')

      .evaluate(function() {
        var photoDivs = document.querySelectorAll('img.rISBZc.M4dUYb');
        var list = [].slice.call(photoDivs);

        return list.map(function(div) {
          return div.src;
        });
      })
      .end()
      .then(function (result) {
        return result.slice(0, 4);
      })
      .then(function (images) {
        res.json(images);
      })
      .catch(function (error) {
        console.error('Search failed:', error);
      });
  }

  findMovieCover(keyword);

});
