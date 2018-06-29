/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const axios = require("axios");

var p = new Promise(function(resolve, reject) {
  console.log("making token request");
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

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const WhereIsMyOrderIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhereIsMyOrder';
  },
  handle(handlerInput) {
    console.log("start handler")
    return p.then(function(arg) {
      console.log("response = ", arg);
      return handlerInput.responseBuilder
        .speak(arg)
        .withSimpleCard('WISMO', arg)
        .getResponse();
    })
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    WhereIsMyOrderIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
.lambda();