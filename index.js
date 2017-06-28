'use strict';
const PSI_ROZA = {
  LOGIN: "3554678395",
  HOST: "http://194.186.207.23",
  HOST_BLOCK: "http://194.186.207.23:9999",
  SMS_PASS: "55098",
  mGUID: "4856a406c200643f529efd6fe5e90fae",
  token: "59821587bc4405b466f4fc6e731efa16",
  PASS: "11223",
  PFMtoken: "b02ddd9811f476eebfbce27ca8f404b1"
};
const GLOBALS = {
  DEVID: "09D4B172-B264-419A-BFBE-6EA7E02B6239",
  VERSION: "9",
  SMS_PASS: "55098",
  operation: "register",
  login: "6435488876",
  version: "9.10",
  appType: "5.5.0",
  deviceName: "Simulator",
  devID: "08D4B172-B264-419A-BFBE-6EA7E00B6239",
  mGUID: "27e5264de6bd37ba4fe37bea592099d4"
}

var Alexa = require("alexa-sdk");
var parse = require('xml-parser');
const axios = require('axios');

const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const tough = require('tough-cookie');
var Cookie = tough.Cookie;
//
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

var instance = axios.create({
  timeout: 30000,
  jar: cookieJar, // tough.CookieJar or boolean
  withCredentials: true,
  headers: {
    'Accept-Language': 'ru;q=1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mobile Device'

  }
});


var aut = function(addr) {
  return instance.post(addr)
};


exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(newSessionHandlers,guessModeHandlers,startGameHandlers);
  alexa.execute();
};

// var handlers = {
  // 'LaunchRequest': function() {
  //   this.emit('SayHello');
  // },
  //
  // SayHello: function() {
  //   this.emit(':ask', 999, 222);
  // },
//   travelintent: function() {
//     this.emit(':ask', "from handlers", 222);
//   }
// };

var states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
    STARTMODE: '_STARTMODE',  // Prompt the user to start or restart the game.
    ENDMODE:'_ENDMODE'
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

            aut(PSI_ROZA.HOST +
              '/CSAMAPI/registerApp.do?operation=register&login=' + PSI_ROZA.LOGIN +
              '&version=' + GLOBALS.VERSION +
              '.10&appType=iPhone&appVersion=5.5.0&deviceName=Simulator&devID=' +
              GLOBALS.DEVID).then(res => {
                var obj = parse(res.data);
                //console.log(obj);
                console.log(obj['root']['children'][0]['children'][0]['content']);
            return obj['root']['children'][2]['children'][0]['content'];

              }).then(mGUID=>{
            console.log(mGUID);
                  return aut(PSI_ROZA.HOST +
                    "/CSAMAPI/registerApp.do?operation=confirm&mGUID=" +
                    mGUID + "&smsPassword=" + PSI_ROZA.SMS_PASS + "&version=" + GLOBALS.VERSION +
                    ".10&appType=iPhone").then(()=>{return mGUID;})

              }).then(mGUID=>{
                console.log(mGUID);
                  this.attributes['mGUID'] = mGUID;
                  return aut(PSI_ROZA.HOST +
                    "/CSAMAPI/registerApp.do?operation=createPIN&mGUID=" +
                    mGUID + "&password=" + PSI_ROZA.PASS + "&version=" + GLOBALS.VERSION +
                    ".10&appType=iPhone" +
                    "&appVersion=5.5.0&deviceName=Simulator&isLightScheme=false&devID=" +
                    GLOBALS.DEVID + "&mobileSdkData=1").then(res => {
                      var obj = parse(res.data);
                      //console.log(res.data);
                      return obj['root']['children'][2]['children'][1]['content'];
                    })

              }).then(token=>{
                console.log(token);
                return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
              "/postCSALogin.do?token=" + token).then(res => {
                var obj = parse(res.data);
                console.log(res.data);
                //return obj['root']['children'][2]['children'][1]['content'];
                var v = obj['root']['children'][2]['children'][3]['content'];
                this.attributes['token'] = token;
                this.handler.state = states.GUESSMODE;
                this.emit(':ask', token, token);
              });
              })

              .catch(function(error) {
                  console.log(error)
                });



          },

          travelintent: function() {
            var self = this;
            this.handler.state = states.GUESSMODE;
            //this.attributes['name'] = this.event.request.intent.slots.MySlot.value;
            //this.emit(':ask', 'Myitem', 'Try saying a number.');
            //var e = this.event.request.intent.slots.About.value.toLowerCase();
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
        this.emit(':ask', this.attributes['token'], this.attributes['mGUID']);
      },
      'Unhandled': function() {
        //  this.handler.state = states.GUESSMODE;
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
      },
      'NotANum': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
      }
    });
