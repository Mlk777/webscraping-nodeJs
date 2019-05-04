const url = 'https://github.com/topics';
const $ = require('cheerio');
const express = require('express');
const rp = require('request-promise');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname, +'/styles'));

app.get('/', (req, res) => {
  rp(url)
    .then(data => {
      //Topics
      let topics = [];
      $('div > .f3', data).each(function() {
        let topic = $(this).text();
        topics.push(topic);
      });
      // console.log(topics);

      //Descriptions
      let descriptions = [];
      $('li > a > div > div > .f5', data).each(function() {
        let description = $(this).text();
        descriptions.push(description);
      });
      // console.log(descriptions);

      //Links
      let links = [];
      $('.py-4 > a', data).each(function() {
        let link = $(this).attr('href');
        links.push(link);
      });
      // console.log(descriptions);

      let result = topics.map((topic, index) => {
        return {
          topic: topic,
          description: descriptions[index],
          link: `https://github.com${links[index]}`
        };
      });

      // console.log(result);

      res.render('index', { result: result });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log('The server is live !');
});
