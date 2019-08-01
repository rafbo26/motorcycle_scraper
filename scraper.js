const rp = require('request-promise');
const cheerio = require('cheerio');

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
    
    console.log(vehInfo);
  })
  .catch((err) => {
    console.log(err);
  });
  
  
  // .listing-key-spec  - information about motorcycle
  // .vehicle-price - price
  
  // ul .search-page__results
  
  // .search-form__count