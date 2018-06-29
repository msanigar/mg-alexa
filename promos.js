const axios = require("axios");

var promos = new Promise(function(resolve, reject) {
  console.log("making promo code request");
  axios
    .get("https://api.makemymeals.co.uk/wp-json/wp/v2/pages?slug=promos")
    .then(res => {
      let text = res.data[0].content.rendered;
      let formattedText = text.toString().replace(/(<([^>]+)>)/g, "");
      console.log(formattedText);
      let formattedString = `hey babes, grab yourself a deal with our current promo codes, ${formattedText}`
      return resolve(formattedString);
    })
    .catch(err => {
      return reject(console.log("oops, that didn't work!", err));
    });
});

promos.then(function(arg) {
  return arg;
});

module.exports = promos;
