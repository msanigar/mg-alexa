const axios = require("axios");

/*
    hit magento signin service with user data
    if correct details return auth token
    hit graphql with auth token and order request data
    return order specific details
*/

const magic = () => {
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
        console.log(res.data);
        
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
            return `hey ${name}, your order is out for delivery babe, it'll be with you soon!`
          case 'Collected':
            return `Hey ${name}, We've just grabbing your stuff and getting it ready!`
          default:
            return `Hey ${name}, we're on it babe`
        }
  
      })
      .catch(err => {
        console.log("oops, that didn't work!", err);
      });
  };  
}

export default magic
