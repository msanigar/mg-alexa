const axios = require("axios");

/*
    hit magento signin service with user data
    if correct details return auth token
    hit graphql with auth token and order request data
    return order specific details
*/

// API KEY has been removed from repo


var wismo = new Promise(function(resolve, reject) {
  console.log("making token request");
  console.log("DEBUG message, API key has been removed, please set manually");
  axios({
    method: "POST",
    headers: { "x-api-key": "" },
    data: {
      Context: {
        MessageID: "123",
        CorrelationID: "456",
        ServiceAdapters: [],
        Properties: [],
        Timestamp: "2018-01-01 13:00:00"
      },
      MGLoginServiceCustomerLoginRequest: {
        EmailAddress: "myles.sanigar@gmail.com",
        Password: "fishandchips"
      }
    },
    url: "https://api-com-testnp.mgnonprod.co.uk/customersignin"
  })
    .then(res => {
      return fetchOrder(res.data.MGLoginServiceCustomerLoginResponse.Token);
    })
    .catch(err => {
      console.log("oops, that didn't work!", err);
    });
  
  const fetchOrder = token => {
    console.log("making gql request");
    axios({
      method: "POST",
      headers: {
        "x-api-key": "",
        AUthorization: token
      },
      data: {
        query: `query {
          orderById(orderId: 27931086) {
            status
          },
          myCustomerInfo {
            firstname
          }
        }`
      },
      url: "https://api-com-testnp.mgnonprod.co.uk/graphql"
    })
      .then(res => {
        console.log(res);
        let name = res.data.data.myCustomerInfo.firstname.toLowerCase()
        let status = res.data.data.orderById.status
  
        /*
          with_currier
          Out_for_delivery
          delivered
          Failed
          Collected
          Refunded 
          pending
          processing
          Order_recieved 
          Order_processing
          Cancelled
          Complete
          ready_for_disptach
        */
  
        switch(status) {
          case 'out_for_delivery':
            return resolve(`hey ${name}, your order is out for delivery babe, it'll be with you soon!`)
          case 'Collected':
            return resolve(`Hey ${name}, We've just grabbing your stuff and getting it ready!`)
          default:
            return resolve(`Hey ${name}, we're on it babe`)
        }
  
      })
      .catch(err => {
        reject("oops, that didn't work!", err);
      });
  }; 
});

module.exports = wismo;
