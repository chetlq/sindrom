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

var xml2 = '<?xml version="1.0" encoding="utf-8"?>' +
  '<root>' +
  '<address>' +
  '<name>Joe Tester1</name>' +
  '<street>Baker street 5</street>' +
  '</address>' +
  '<address>' +
  '<name>Joe Tester2</name>' +
  '<street>Baker street 5</street>' +
  '</address>' +
  '</root>';




var aut = function(addr) {
  return instance.post(addr)
};
//
// aut(PSI_ROZA.HOST +
//   '/CSAMAPI/registerApp.do?operation=register&login=' + PSI_ROZA.LOGIN +
//   '&version=' + GLOBALS.VERSION +
//   '.10&appType=iPhone&appVersion=5.5.0&deviceName=Simulator&devID=' +
//   GLOBALS.DEVID).then(res => {
//     var obj = parse(res.data);
//     //console.log(obj);
//     console.log(obj['root']['children'][0]['children'][0]['content']);
// return obj['root']['children'][2]['children'][0]['content'];
//
//   }).then(mGUID=>{
// console.log(mGUID);
//       return aut(PSI_ROZA.HOST +
//         "/CSAMAPI/registerApp.do?operation=confirm&mGUID=" +
//         mGUID + "&smsPassword=" + PSI_ROZA.SMS_PASS + "&version=" + GLOBALS.VERSION +
//         ".10&appType=iPhone").then(()=>{return mGUID;})
//
//   }).then(mGUID=>{
//     console.log(mGUID);
//       return aut(PSI_ROZA.HOST +
//         "/CSAMAPI/registerApp.do?operation=createPIN&mGUID=" +
//         mGUID + "&password=" + PSI_ROZA.PASS + "&version=" + GLOBALS.VERSION +
//         ".10&appType=iPhone" +
//         "&appVersion=5.5.0&deviceName=Simulator&isLightScheme=false&devID=" +
//         GLOBALS.DEVID + "&mobileSdkData=1").then(res => {
//           var obj = parse(res.data);
//           //console.log(res.data);
//           return obj['root']['children'][2]['children'][1]['content'];
//         })
//
//   }).then(token=>{
//     console.log(token);
//     return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
//   "/postCSALogin.do?token=" + token).then(res => {
//     var obj = parse(res.data);
//     console.log(res.data);
//     //return obj['root']['children'][2]['children'][1]['content'];
//     console.log(obj['root']['children'][2]['children'][3]['content']);
//   });
//   })
//
//   .catch(function(error) {
//       console.log(error)
//     });



exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() {
    this.emit('SayHello');
  },
  'HelloWorldIntent': function() {
    this.emit('SayHello');
  },
  SayHello: function() {
    aut(PSI_ROZA.HOST +
        '/CSAMAPI/registerApp.do?operation=register&login=' + PSI_ROZA.LOGIN +
        '&version=' + GLOBALS.VERSION +
        '.10&appType=iPhone&appVersion=5.5.0&deviceName=Simulator&devID=' +
        GLOBALS.DEVID).then(res => {
        var obj = parse(res.data);
        //console.log(obj);
        console.log(obj['root']['children'][0]['children'][0]['content']);
        return obj['root']['children'][2]['children'][0]['content'];

      }).then(mGUID => {
        return aut(PSI_ROZA.HOST +
          "/CSAMAPI/registerApp.do?operation=confirm&mGUID=" +
          mGUID + "&smsPassword=" + PSI_ROZA.SMS_PASS + "&version=" + GLOBALS.VERSION +
          ".10&appType=iPhone").then(() => {
          return mGUID;
        })
      }).then(mGUID => {
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
      }).then(token => {
            return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
          "/postCSALogin.do?token=" + token).then(res => {
            var obj = parse(res.data);

            //console.log(res.data);
            var v= (obj['root']['children'][2]['children'][3]['content']);
        this.emit(':ask', v, 333);
      })})
      .catch(function(error) {
        this.emit(':ask', 666, 333);
        console.log(error)
      });


  },
  travelintent: function() {
    this.emit(':ask', 222, 222);
  }
};
