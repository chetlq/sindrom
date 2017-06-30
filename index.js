'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers);
  alexa.execute();
};


var states = {
  GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
  STARTMODE: '_STARTMODE', // Prompt the user to start or restart the game.
  ENDMODE: '_ENDMODE'
};

var newSessionHandlers = {
  'NewSession': function() {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', 'Welcome ');
    //'Say yes to start the game or no to quit.
  }
};


var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
      'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
      },

      'HelloWorldIntent': function() {

          var cardTitle = 'Hello World<p> Card';
          var cardContent = 'This text will be displayed in the companion app card.';

          var imageObj = {
            smallImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
            largeImageUrl: 'https://imgs.xkcd.com/comics/standards.png'
          };

          var permissionArray = ['read::alexa:device:all:address'];

          var updatedIntent = this.event.request.intent;

          var slotToElicit = "Slot to elicit";

          var slotToConfirm = "Slot to confirm";

          //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

          this.emit(':tellWithCard', cardContent, cardTitle, res);
      },


  travelintent: function() {

    this.handler.state = states.GUESSMODE;
    this.emit(':ask', 'startGameHandlers', 'Try saying a number.');
  },

  'Unhandled': function() {
    console.log("UNHANDLED");
    var message = 'Repeat the name of the recipient.';
    this.emit(':ask', message, message);
  }
});


var guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
  'NewSession': function() {

    this.handler.state = '';
    this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
  },
  'HelloWorldIntent': function() {
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
  },
  'Unhandled': function() {
    //  this.handler.state = states.GUESSMODE;
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
  },
  'NotANum': function() {
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
  }
});
