var Alexa = require('alexa-sdk');
var ical = require('ical');
var http = require('http');
var utils = require('util');

 var date = require('./calendar');
var calendar = new date();

var states = {
    SEARCHMODE: '_SEARCHMODE',
    DESCRIPTION: '_DESKMODE',
};
// local variable holding reference to the Alexa SDK object
var alexa;

//OPTIONAL: replace with "amzn1.ask.skill.[your-unique-value-here]";
var APP_ID = undefined;

// URL to get the .ics from, in this instance we are getting from Stanford however this can be changed
var URL = "http://events.stanford.edu/eventlist.ics";

// Skills name
var skillName = "Events calendar:";

// Message when the skill is first called
var welcomeMessage = "You can ask for the events today. Search for events by date. or say help. What would you like? ";

// Message for help intent
var HelpMessage = "Here are some things you can say: Is there an event today? Is there an event on the 18th of July? What are the events next week? Are there any events tomorrow?  What would you like to know?";

var descriptionStateHelpMessage = "Here are some things you can say: Tell me about event one";

// Used when there is no data within a time period
var NoDataMessage = "Sorry there aren't any events scheduled. Would you like to search again?";

// Used to tell user skill is closing
var shutdownMessage = "Ok see you again soon.";

// Message used when only 1 event is found allowing for difference in punctuation
var oneEventMessage = "There is 1 event ";

// Message used when more than 1 event is found allowing for difference in punctuation
var multipleEventMessage = "There are %d events ";

// text used after the number of events has been said
var scheduledEventMessage = "scheduled for this time frame. I've sent the details to your Alexa app: ";

var firstThreeMessage = "Here are the first %d. ";

// the values within the {} are swapped out for variables
var eventSummary = "The %s event is, %s at %s on %s ";

// Only used for the card on the companion app
var cardContentSummary = "%s at %s on %s ";

// More info text
var haveEventsRepromt = "Give me an event number to hear more information.";

// Error if a date is out of range
var dateOutOfRange = "Date is out of range please choose another date";

// Error if a event number is out of range
var eventOutOfRange = "Event number is out of range please choose another event";

// Used when an event is asked for
var descriptionMessage = "Here's the description ";

// Used when an event is asked for
var killSkillMessage = "Ok, great, see you next time.";

var eventNumberMoreInfoText = "You can say the event number for more information.";

// used for title on companion app
var cardTitle = "Events";

// output for Alexa
var output = "";

// stores events that are found to be in our date range
var relevantEvents = new Array();

// Adding session handlers
var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        this.emit(':ask', skillName + " " + welcomeMessage, welcomeMessage);
    },
    "searchIntent": function()
    {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState("searchIntent");
    },
    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    },
};

// Create a new handler with a SEARCH state
var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.YesIntent': function () {
        output = welcomeMessage;
        alexa.emit(':ask', output, welcomeMessage);
    },

    'AMAZON.NoIntent': function () {
        this.emit(':tell', shutdownMessage);
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'eventIntent': function() {
      /*
      var eventList = new Array();
      var slotValuefrom = this.event.request.intent.slots.datefrom.value;
      var slotValueto = this.event.request.intent.slots.dateto.value;

      if ((slotValuefrom != undefined) && (slotValueto != undefined)) {
        var parent = this;

        var eventDatefrom = getDateFromSlot(slotValuefrom);
        var eventDateto = getDateFromSlot(slotValueto);

        //  this.emit(':ask', "start: "+new Date(eventDate.startDate)+" - end: " + new Date(eventDate.endDate), HelpMessage);
        var str = "start: " + new Date(eventDatefrom.startDate) + " - end: " + new Date(eventDateto.endDate);
        alexa.emit(':askWithCard', cardTitle, haveEventsRepromt, cardTitle, str);
      } else {
        this.emit(":ask", "I'm sorry.  What day did you want me to look for events?", "I'm sorry.  What day did you want me to look for events?");
      }
*/
    },

    'searchIntent': function () {
        // Declare variables
        var eventList = new Array();
        var slotValue = this.event.request.intent.slots.date.value;
        if (slotValue != undefined)
        {
            var parent = this;

            var eventDate = calendar.getDateFromSlot(slotValue);

          //  this.emit(':ask', "start: "+new Date(eventDate.startDate)+" - end: " + new Date(eventDate.endDate), HelpMessage);
          var str = "start: "+new Date(eventDate.startDate)+" - end: " + new Date(eventDate.endDate);
          alexa.emit(':askWithCard', eventDate.res, haveEventsRepromt, cardTitle, str);

        }
        else {
            this.emit(":ask", "I'm sorry.  What day did you want me to look for events?", "I'm sorry.  What day did you want me to look for events?");
        }
    },

    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, output);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});

// Create a new handler object for description state
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTION, {

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', descriptionStateHelpMessage, descriptionStateHelpMessage);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.NoIntent': function () {
        this.emit(':tell', shutdownMessage);
    },

    'AMAZON.YesIntent': function () {
        output = welcomeMessage;
        alexa.emit(':ask', eventNumberMoreInfoText, eventNumberMoreInfoText);
    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});

// register handlers
exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, descriptionHandlers);
    alexa.execute();
};
//======== HELPER FUNCTIONS ==============

// Remove HTML tags from string
function removeTags(str) {
    if (str) {
        return str.replace(/<(?:.|\n)*?>/gm, '');
    }
}



// Create a new handler object for description state
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTION, {
    'eventIntent': function () {

        var repromt = " Would you like to hear another event?";
        var slotValue = this.event.request.intent.slots.number.value;

        // parse slot value
        var index = parseInt(slotValue) - 1;

        if (relevantEvents[index]) {

            // use the slot value as an index to retrieve description from our relevant array
            output = descriptionMessage + removeTags(relevantEvents[index].description);

            output += repromt;

            this.emit(':askWithCard', output, repromt, relevantEvents[index].summary, output);
        } else {
            this.emit(':tell', eventOutOfRange);
        }
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', descriptionStateHelpMessage, descriptionStateHelpMessage);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.NoIntent': function () {
        this.emit(':tell', shutdownMessage);
    },

    'AMAZON.YesIntent': function () {
        output = welcomeMessage;
        alexa.emit(':ask', eventNumberMoreInfoText, eventNumberMoreInfoText);
    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});

// register handlers
exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, descriptionHandlers);
    alexa.execute();
};
