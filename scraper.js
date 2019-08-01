const rp = require('request-promise');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const options = {
  uri: "https://www.autotrader.co.uk/bike-search?sort=price-asc&radius=1500&postcode=ox143uu&make=YAMAHA&model=MT-07&price-from=3500&price-to=4500&maximum-mileage=15000&page=1",
  transform: function(body) {
    cheerio.load(body);
  }
}

rp(options.uri)
  .then((html) => {
    const $ = cheerio.load(html)
    let vehicles = $('ul.search-page__results > li');
    let vehNum = $('.search-form__count').text().split(' ')[0];
    let vehInfo = [];

    vehicles.each(function() {
      const info = $(this).find('ul.listing-key-specs > li');
      const location = $(this).find('.seller-location').text().replace(/\n/g, '').trim();
      const price = $(this).find('.vehicle-price').text();
      let data = [];
      
      info.each(function() {
        let item = $(this).text();
        data.push(item);
      });
      
      vehInfo.push({ info: data.join(' '), loc: location, price: price });
    });
    
    sendEmail(vehInfo)
  })
  .catch((err) => {
    console.log(err);
  });
  
  
  function sendEmail(veh) {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: ''
      }
    });
    
    const mailOptions = {
      from: '',
      to: '',
      subject: 'Yamaha MT',
      text: JSON.stringify(veh)
    }
    
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
    
  }
  
  
  // .listing-key-spec  - information about motorcycle
  // .vehicle-price - price
  
  // ul .search-page__results
  
  // .search-form__count
  
 // <img data-label="search appearance click " src="https://m.atcdn.co.uk/a/media/w260h196pd8d8d8/25a038d23fe549c6b5186c381d64452b.jpg">