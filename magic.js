const axios = require("axios");

/*
    hit magento signin service with user data
    if correct details return auth token
    hit graphql with auth token and order request data
    return order specific details
*/

axios({
  method: "POST",
  headers: { "x-api-key": "fNjoFuIfYBnnysXE6dmw2EPnjuEr2Ss8vJ31YoW1" },
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
    console.log(
      "successfully authenticated, here's your token! ",
      res.data.MGLoginServiceCustomerLoginResponse.Token
    );
    return fetchOrder(res.data.MGLoginServiceCustomerLoginResponse.Token);
  })
  .catch(err => {
    console.log("oops, that didn't work!", err);
  });

const fetchOrder = token => {
  axios({
    method: "POST",
    headers: {
      "x-api-key": "fNjoFuIfYBnnysXE6dmw2EPnjuEr2Ss8vJ31YoW1",
      AUthorization: token
    },
    data: {
      query: `query {
        orderById(orderId: 27950103) {
          status
        }
      }`
    },
    url: "https://api-com-testnp.mgnonprod.co.uk/graphql"
  })
    .then(res => {
      console.log(res.data);
      // return the status here
    })
    .catch(err => {
      console.log("oops, that didn't work!", err);
    });
};
