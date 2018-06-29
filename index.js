const Alexa = require('ask-sdk-core');
const wismo = require('./wismo.js');
const promo = require('./promos.js');
const Wear = require('wear.js');

// Text constants
const CARD_TITLE = 'Missguided'
const LAUNCH_MESSAGE = 'What\'s up, babe?';
const LAUNCH_REPROMPT = 'What\'s up, babe?';
const HELLO_MESSAGE = 'Hello';
const HELLO_REPROMPT = 'Hello';
const HELP_MESSAGE = 'At your service my babe';
const HELP_REPROMPT = 'What can I help you with?';
const ABOUT_MESSAGE = 'Our mission is to empower females globally to be confident in themselves and be who they want to be. Missguided is a bold, straight talking and forward thinking fashion brand inspired by real life that aims to do exactly that. Everything we create is informed by our customer along with global influences like social media, street style, and popular culture, creating a destination that delivers and encompasses everything it means to be a girl on the go in the world today.';
const ABOUT_REPROMPT = 'About me';
const GOODBYE_MESSAGE = 'See you next time, Babe';
const GOODBYE_REPROMPT = 'Goodbye';

// Alexa Config Constants
const PERSON_WEAR_SLOT = 'Person';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      return handlerInput.responseBuilder
          .speak(LAUNCH_MESSAGE)
          .reprompt(LAUNCH_REPROMPT)
          .withSimpleCard(CARD_TITLE, LAUNCH_MESSAGE)
          .getResponse();
  },
};

//Hello Handler
const HelloIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
      return handlerInput.responseBuilder
          .speak(HELLO_MESSAGE)
          .reprompt(HELLO_REPROMPT)
          .withSimpleCard(CARD_TITLE, HELLO_REPROMPT)
          .getResponse();
  },
};

const WearIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'WearIntent';
  },
  handle(handlerInput) {
      const person = handlerInput.requestEnvelope.request.intent.slots[PERSON_WEAR_SLOT];
      const wearResult = Wear.getWearByPerson(person)
      return handlerInput.responseBuilder
          .speak(wearResult.speak)
          .reprompt(wearResult.repromopt)
          .withStandardCard(CARD_TITLE, wearResult.repromopt, wearResult.image, wearResult.image)
          .getResponse();
  },
};

//Random 2 character handler
const RandomIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'RandomIntent';
  },
  handle(handlerInput) {
      const speechText = RandomName.generateName();

      return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard(CARD_TITLE, speechText)
          .getResponse();
  },
};

//About us handler
const AboutIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
      return handlerInput.responseBuilder
          .speak(ABOUT_MESSAGE)
          .reprompt(ABOUT_REPROMPT)
          .withSimpleCard(CARD_TITLE, ABOUT_MESSAGE)
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
    return wismo.then(function(arg) {
      console.log("response = ", arg);
      return handlerInput.responseBuilder
        .speak(arg)
        .withSimpleCard('WISMO', arg)
        .getResponse();
    })
  },
};

const GetPromoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetPromo';
  },
  handle(handlerInput) {
    console.log("start handler")
    return promo.then(function(arg) {
      console.log("response = ", arg);
      return handlerInput.responseBuilder
        .speak(arg)
        .withSimpleCard('Some Promo Codes', arg)
        .getResponse();
    })
  },
};

//Default Help Handler
const HelpIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
      return handlerInput.responseBuilder
          .speak(HELP_MESSAGE)
          .reprompt(HELP_REPROMPT)
          .withSimpleCard(CARD_TITLE, HELP_MESSAGE)
          .getResponse();
  },
};

//Default stop Handler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
      return handlerInput.responseBuilder
          .speak(GOODBYE_MESSAGE)
          .reprompt(GOODBYE_REPROMPT)
          .withSimpleCard(CARD_TITLE, GOODBYE_MESSAGE)
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
    HelloIntentHandler,
    WearIntentHandler,
    RandomIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    WhereIsMyOrderIntentHandler,
    GetPromoIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
.lambda();