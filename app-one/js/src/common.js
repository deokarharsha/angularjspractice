// common functions
function normalize(data) {
  var parser = '';
  for (var key in data) {
    if (key.indexOf('date') > -1 || key.indexOf('Dt') > - 1) {
      if (data[key] == undefined || data[key] == '') {
        parser += ',';
      } else {
        parser += data[key].slice(6,10) + '/' + data[key].slice(3,5) + '/' + data[key].slice(0,2) + ',';
      }
    } else if (data[key] == null) {
      parser += ',';
    } else {
      parser += String(data[key]).replace(/,/g, ';') + ','; // replace commas
    }
  }
  return parser.replace(/,\s*$/, ""); // remove last comma
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function randomString(length) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = length;
  var randomString = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum,rnum+1);
  }

  return randomString;
}

function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  /* jshint -W033 */
  if (dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
  /* jshint -W004 */
  var today = dd+'/'+mm+'/'+yyyy;

  return today;
}

function getCurrentDateTime() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  var hh = today.getHours();
  var nn = today.getMinutes();
  var ss = today.getSeconds();

  /* jshint -W033 */
  if (dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} if(hh<10){hh='0'+hh} if(nn<10){nn='0'+nn} if(ss<10){ss='0'+ss}
  /* jshint -W004 */
  var today = dd+'/'+mm+'/'+yyyy+' '+hh+':'+nn+':'+ss;

  return today;
}
