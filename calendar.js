var calendar = function(){


function removeTags(str) {
    if (str) {
        return str.replace(/<(?:.|\n)*?>/gm, '');
    }
}

// Given an AMAZON.DATE slot value parse out to usable JavaScript Date object
// Utterances that map to the weekend for a specific week (such as �this weekend�) convert to a date indicating the week number and weekend: 2015-W49-WE.
// Utterances that map to a month, but not a specific day (such as �next month�, or �December�) convert to a date with just the year and month: 2015-12.
// Utterances that map to a year (such as �next year�) convert to a date containing just the year: 2016.
// Utterances that map to a decade convert to a date indicating the decade: 201X.
// Utterances that map to a season (such as �next winter�) convert to a date with the year and a season indicator: winter: WI, spring: SP, summer: SU, fall: FA)
function getDateFromSlot(rawDate) {
    // try to parse data
    var date = new Date(Date.parse(rawDate));
    var result;
    // create an empty object to use later
    var eventDate = {

    };

    // if could not parse data must be one of the other formats
    if (isNaN(date)) {
        // to find out what type of date this is, we can split it and count how many parts we have see comments above.
        var res = rawDate.split("-");
        // if we have 2 bits that include a 'W' week number
        if (res.length === 2 && res[1].indexOf('W') > -1) {
            var dates = getWeekData(res);
            eventDate["startDate"] = new Date(dates.startDate);
            eventDate["endDate"] = new Date(dates.endDate);
            eventDate["res"] = 22;
            // if we have 3 bits, we could either have a valid date (which would have parsed already) or a weekend
        } else if (res.length === 3) {
            var dates = getWeekendData(res);
            eventDate["startDate"] = new Date(dates.startDate);
            eventDate["endDate"] = new Date(dates.endDate);
            eventDate["res"] = 33;
            // anything else would be out of range for this skill
        } else {
            eventDate["error"] = dateOutOfRange;
        }
        // original slot value was parsed correctly
    } else {
      var res = rawDate.split("-");
      if (res.length === 1){
        eventDate["startDate"] = new Date(date).setUTCHours(0, 0, 0, 0);
        var endDate = new Date(date.getFullYear()+1, 0,  0).setUTCHours(24, 0, 0, 0);
        eventDate["endDate"] = endDate;
        eventDate["res"] = res.length;
      }
      else if (res.length === 2  && res[1].indexOf('FA') == -1 && res[1].indexOf('WI') == -1 && res[1].indexOf('SP') == -1 && res[1].indexOf('SU') == -1) {
          eventDate["startDate"] = new Date(date).setUTCHours(0, 0, 0, 0);
          var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + getLastDayOfMonth(res[0],res[1])).setUTCHours(24, 0, 0, 0);
          eventDate["endDate"] = endDate;//new Date(date).setUTCHours(24, 0, 0, 0);
          // eventDate["startDate"] = new Date(dates.startDate);
          // eventDate["endDate"] = new Date(dates.endDate);
          eventDate["res"] = res.length;
          // if we have 3 bits, we could either have a valid date (which would have parsed already) or a weekend
      } else {
        eventDate["startDate"] = new Date(date).setUTCHours(0, 0, 0, 0);
        eventDate["endDate"] = new Date(date).setUTCHours(24, 0, 0, 0);
        eventDate["res"] = res.length;
      }

    }
    return eventDate;
}
function getLastDayOfMonth(year, month) {
  var date = new Date(year, month + 1, 0);
  return date.getDate();
}


// Given a week number return the dates for both weekend days
function getWeekendData(res) {
    if (res.length === 3) {
        var saturdayIndex = 5;
        var sundayIndex = 6;
        var weekNumber = res[1].substring(1);

        var weekStart = w2date(res[0], weekNumber, saturdayIndex);
        var weekEnd = w2date(res[0], weekNumber, sundayIndex);

        return Dates = {
            startDate: weekStart,
            endDate: weekEnd,
        };
    }
}

// Given a week number return the dates for both the start date and the end date
function getWeekData(res) {
    if (res.length === 2) {

        var mondayIndex = 0;
        var sundayIndex = 6;

        var weekNumber = res[1].substring(1);

        var weekStart = w2date(res[0], weekNumber, mondayIndex);
        var weekEnd = w2date(res[0], weekNumber, sundayIndex);

        return Dates = {
            startDate: weekStart,
            endDate: weekEnd,
        };
    }
}

// Used to work out the dates given week numbers
var w2date = function (year, wn, dayNb) {
    var day = 86400000;

    var j10 = new Date(year, 0, 10, 12, 0, 0),
        j4 = new Date(year, 0, 4, 12, 0, 0),
        mon1 = j4.getTime() - j10.getDay() * day;
    return new Date(mon1 + ((wn - 1) * 7 + dayNb) * day);
};

// Loops though the events from the iCal data, and checks which ones are between our start data and out end date
function getEventsBeweenDates(startDate, endDate, eventList) {

    var start = new Date(startDate);
    var end = new Date(endDate);

    var data = new Array();

    for (var i = 0; i < eventList.length; i++) {
        if (start <= eventList[i].start && end >= eventList[i].start) {
            data.push(eventList[i]);
        }
    }

    console.log("FOUND " + data.length + " events between those times");
    return data;
}
}
module.exports = calendar;
