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
  alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers);
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



        var cardTitle = 'Hello World Card';
        var cardContent = '<font size="2"> small (28px) </font>This text will be displayed in the companion app card.';

        var imageObj = {
          smallImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
          largeImageUrl: 'https://imgs.xkcd.com/comics/standards.png'
        };

        var permissionArray = ['read::alexa:device:all:address'];

        var updatedIntent = this.event.request.intent;

        var slotToElicit = "Slot to elicit";

        var slotToConfirm = "Slot to confirm";

        //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

        this.emit(':tellWithCard', cardContent, cardTitle, cardContent);





/*
        var promise = new Promise(function(resolve, reject) {




          aut(PSI_ROZA.HOST +
              '/CSAMAPI/registerApp.do?operation=register&login=' + PSI_ROZA.LOGIN +
              '&version=' + GLOBALS.VERSION +
              '.10&appType=iPhone&appVersion=5.5.0&deviceName=Simulator&devID=' +
              GLOBALS.DEVID).then(res => {
              var obj = parse(res.data);
              //console.log(obj);
              //console.log(obj['root']['children'][0]['children'][0]['content']);
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
                var v2 = obj['root']['children'][2]['children'][1]['content'];

                return v2;
              })

            }).then(token => {

              return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
                "/postCSALogin.do?token=" + token).then(res => {})

            }).then(() => {
              return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
                "/private/payments/list.do?from=08.11.2015&to=31.03.2018&paginationSize=20&paginationOffset=0"
              ).then(res => {
                return res
              });


            }).then((res) => {

              var obj = parse(res.data);





              var arr2 = [];
              var myobj = {};
              var k = function(obj) {

                if (Array.isArray(obj)) {

                  obj.forEach(function(item, i) {
                    k(item);
                  });
                } else {
                  if (obj.name == 'operation') {
                    //console.log(obj.children[1]);
                    arr2.push(obj.children)
                  } else {
                    k(obj.children)
                  }
                }
              };


              //console.log(obj.root);
              k(obj.root);

              //console.log(arr2[0][0]);


              var arr3 = [];
                   arr2.forEach(function(item, i) {
                     var ob = {};
                     item.forEach(function(item2, i2) {
                       if (item2.name == 'type') {
                         ob.type = item2.content
                       }
                       if (item2.name == 'form') {
                         ob.form = item2.content
                       }
                       if (item2.name == 'date') {
                         ob.date = item2.content
                       }
                       if (item2.name == 'operationAmount') {
                         item2.children.forEach(function(item3, i3) {
                           if (item3.name == 'amount') {
                             ob.amount = item3.content;
                           }
                           if (item3.name == 'currency') {
                             ob.code = item3.children[0].content;
                           }
                         });
                       }
                     });
                     arr3.push(ob)
                       //console.log(item[0]);
                   });
                   var str = "";

                   arr3.forEach(function(item, i) {
                     str += item.type + " :: " + item.form + " :: " + item.date +
                       " :: " + item.amount + " :: " + item.code + "\n";
                   });
                   //console.log(str);

              resolve(str);
            })
            .catch(res => {
              reject(0);
              // reject(0);
              //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
            });

        });

        promise.then(res => {
          var cardTitle = 'Hello World Card';
          var cardContent = '<font size="2"> small (28px) </font>This text will be displayed in the companion app card.';

          var imageObj = {
            smallImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
            largeImageUrl: 'https://imgs.xkcd.com/comics/standards.png'
          };

          var permissionArray = ['read::alexa:device:all:address'];

          var updatedIntent = this.event.request.intent;

          var slotToElicit = "Slot to elicit";

          var slotToConfirm = "Slot to confirm";

          //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

          this.emit(':tellWithCard', cardContent, cardTitle, cardContent);

        }).catch(res => {
          //this.emit(':tellWithCard',res, cardTitle,res, imageObj);
        });
*/



      },
    // var promise = new Promise(function(resolve, reject) {
    //
    //     aut(PSI_ROZA.HOST +
    //         '/CSAMAPI/registerApp.do?operation=register&login=' + PSI_ROZA.LOGIN +
    //         '&version=' + GLOBALS.VERSION +
    //         '.10&appType=iPhone&appVersion=5.5.0&deviceName=Simulator&devID=' +
    //         GLOBALS.DEVID).then(res => {
    //         var obj = parse(res.data);
    //         //console.log(obj);
    //         //console.log(obj['root']['children'][0]['children'][0]['content']);
    //         return obj['root']['children'][2]['children'][0]['content'];
    //
    //       }).then(mGUID => {
    //         //console.log(mGUID);
    //         return aut(PSI_ROZA.HOST +
    //           "/CSAMAPI/registerApp.do?operation=confirm&mGUID=" +
    //           mGUID + "&smsPassword=" + PSI_ROZA.SMS_PASS + "&version=" + GLOBALS.VERSION +
    //           ".10&appType=iPhone").then(() => {
    //           return mGUID;
    //         })
    //
    //       }).then(mGUID => {
    //         //console.log(mGUID);
    //         this.attributes['mGUID'] = mGUID;
    //         return aut(PSI_ROZA.HOST +
    //           "/CSAMAPI/registerApp.do?operation=createPIN&mGUID=" +
    //           mGUID + "&password=" + PSI_ROZA.PASS + "&version=" + GLOBALS.VERSION +
    //           ".10&appType=iPhone" +
    //           "&appVersion=5.5.0&deviceName=Simulator&isLightScheme=false&devID=" +
    //           GLOBALS.DEVID + "&mobileSdkData=1").then(res => {
    //           var obj = parse(res.data);
    //           //console.log(res.data);
    //           return obj['root']['children'][2]['children'][1]['content'];
    //         })
    //
    //       }).then(token => {
    //         console.log(token);
    //         return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
    //           "/postCSALogin.do?token=" + token).then(res => {
    //
    //           resolve(1);
    //
    //         });
    //       })
    //       .catch(res => {
    //         reject(0);
    //         //this.emit(':tellWithCard', "success", cardTitle, res + cardContent, imageObj);
    //       });
    //
    //   }); // end Promise






                // var obj = parse(res.data);
                // //console.log(res.data);
                // //return obj.root.name;
                // //
                // var arr2 = [];
                // var myobj = {};
                // var k = function(obj) {
                //
                //   if (Array.isArray(obj)) {
                //
                //     obj.forEach(function(item, i) {
                //       k(item);
                //     });
                //   } else {
                //     if (obj.name == 'operation') {
                //       //console.log(obj.children[1]);
                //       arr2.push(obj.children)
                //     } else {
                //       k(obj.children)
                //     }
                //   }
                // };
                //
                //
                // //console.log(obj.root);
                // k(obj.root);
                //
                // //console.log(arr2[0][0]);
                //
                //
                // var arr3 = [];
                // arr2.forEach(function(item, i) {
                //   var ob = {};
                //   item.forEach(function(item2, i2) {
                //     if (item2.name == 'type') {
                //       ob.type = item2.content
                //     }
                //     if (item2.name == 'form') {
                //       ob.form = item2.content
                //     }
                //     if (item2.name == 'date') {
                //       ob.date = item2.content
                //     }
                //     if (item2.name == 'operationAmount') {
                //       item2.children.forEach(function(item3, i3) {
                //         if (item3.name == 'amount') {
                //           ob.amount = item3.content;
                //         }
                //         if (item3.name == 'currency') {
                //           ob.code = item3.children[0].content;
                //         }
                //       });
                //     }
                //   });
                //   arr3.push(ob)
                //   //console.log(item[0]);
                // });
                // var str = "str: ";
                // arr3.forEach(function(item, i) {
                //   str +=item.type + " :: " + item.form + " :: " + item.date +  " :: " + item.amount + " :: " + item.code + "\n"
                // });





      //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);



    /*
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
                console.log(mGUID);
                return aut(PSI_ROZA.HOST +
                  "/CSAMAPI/registerApp.do?operation=confirm&mGUID=" +
                  mGUID + "&smsPassword=" + PSI_ROZA.SMS_PASS + "&version=" + GLOBALS.VERSION +
                  ".10&appType=iPhone").then(() => {
                  return mGUID;
                })

              }).then(mGUID => {
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

              }).then(token => {
                console.log(token);
                 return aut(PSI_ROZA.HOST_BLOCK + "/mobile" + GLOBALS.VERSION +
                  "/postCSALogin.do?token=" + token).then(res => {

                    var p = new Promise(function(resolve,reject){
                      var obj = parse(res.data);
                      //console.log(res.data);
                      //return obj.root.name;
                      //
                      var arr2 = [];
                      var myobj = {};
                      var k = function(obj) {

                        if (Array.isArray(obj)) {

                          obj.forEach(function(item, i) {
                            k(item);
                          });
                        } else {
                          if (obj.name == 'operation') {
                            //console.log(obj.children[1]);
                            arr2.push(obj.children)
                          } else {
                            k(obj.children)
                          }
                        }
                      };


                      //console.log(obj.root);
                      k(obj.root);

                      //console.log(arr2[0][0]);


                      var arr3 = [];
                      arr2.forEach(function(item, i) {
                        var ob = {};
                        item.forEach(function(item2, i2) {
                          if (item2.name == 'type') {
                            ob.type = item2.content
                          }
                          if (item2.name == 'form') {
                            ob.form = item2.content
                          }
                          if (item2.name == 'date') {
                            ob.date = item2.content
                          }
                          if (item2.name == 'operationAmount') {
                            item2.children.forEach(function(item3, i3) {
                              if (item3.name == 'amount') {
                                ob.amount = item3.content;
                              }
                              if (item3.name == 'currency') {
                                ob.code = item3.children[0].content;
                              }
                            });
                          }
                        });
                        arr3.push(ob)
                        //console.log(item[0]);
                      });
                      var str = "str: ";
                      arr3.forEach(function(item, i) {
                        str +=item.type + " :: " + item.form + " :: " + item.date +  " :: " + item.amount + " :: " + item.code + "\n"
                      });
                      resolve(1);
                    });
                  return p.then(res=>{
                    return res;
                  }).cath(res=>{
                    return "error";
                  })
    */


    //this.emit(':ask', token, token);


    //   }).then(res=>{
    //
    //                   //return obj['root']['children'][2]['children'][1]['content'];
    //                   //var v = obj['root']['children'][2]['children'][3]['content'];
    //                   //this.attributes['token'] = token;
    //                   //this.handler.state = states.GUESSMODE;
    //                   var cardTitle = 'Hello World Card';
    //                   var cardContent = 'This text will be displayed in the companion app card.';
    //
    //                   var imageObj = {
    //                     smallImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
    //                     largeImageUrl: 'https://imgs.xkcd.com/comics/standards.png'
    //                   };
    //
    //                   var permissionArray = ['read::alexa:device:all:address'];
    //
    //                   var updatedIntent = this.event.request.intent;
    //
    //                   var slotToElicit = "Slot to elicit";
    //
    //                   var slotToConfirm = "Slot to confirm";
    //
    //                   //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
    //
    //                   this.emit(':tellWithCard', "success", cardTitle, res+cardContent, imageObj);
    //   });
    // })
    //
    // .catch(function(error) {
    //   console.log(error)
    // });




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
