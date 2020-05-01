const express = require('express')
const app = express();
const covid19api = require('covid19-api');
const ejs = require('ejs');
const https = require('https');
var fs = require('fs');
const d3 = require('d3');
const schedule = require('node-schedule')
const port = process.env.PORT || 3000;

//firt date is 2020-01-22T00:00:00Z
var tmppp;
async function test(){
  tmppp = await covid19api.getReportsByCountries(['Greenland']);
  console.log(tmppp);
}

test();

var firstD = new Date('January 22, 2020 00:00:00 GMT+00:00');
var today = new Date(new Date().toUTCString());
diff = Math.floor((today.getTime()- firstD.getTime())/(1000*3600*24));
todayString = today.toDateString();

var countryDict = {'Afghanistan':{}, 'Antarctica': {}, 'Albania':{},'Algeria':{},'Andorra':{},'Angola':{},'Antigua and Barbuda':{},'Argentina':{},'Armenia':{},'Australia':{},'Austria':{},'Azerbaijan':{},'Bahamas':{},'Bahrain':{},'Bangladesh':{},'Barbados':{},'Belarus':{},'Belgium':{},
'Belize':{},'Benin':{},'Bhutan':{},'Bolivia':{},'Bosnia and Herzegovina':{},'Botswana':{},'Brazil':{},'Brunei':{},'Bulgaria':{},'Burkina Faso':{},'Burundi':{},'Cabo Verde':{},'Cambodia':{},'Cameroon':{},'Canada':{},'Central African Republic':{},'Chad':{},'Chile':{},'China':{},'Colombia':{},'Comoros':{},'Republic of the Congo':{},
'Democratic Republic of the Congo':{},'Costa Rica':{},"CI":{},'Croatia':{},'Cuba':{},'Cyprus':{},'Czechia':{},'Denmark':{},'Djibouti':{},'Dominica':{},'Dominican Republic':{},'Ecuador':{},'Egypt':{},'El Salvador':{},'Equatorial Guinea':{},'Eritrea':{},'Estonia':{},'Eswatini':{},'Ethiopia':{},'Fiji':{},'Finland':{},'France':{},
'Gabon':{},'Gambia':{},'Georgia':{},'Germany':{},'Ghana':{},'Greece':{}, 'Greenland':{}, 'Grenada':{},'Guatemala':{},'Guinea':{},'Guinea-Bissau':{},'Guyana':{},'Haiti':{},'Holy See':{},'Honduras':{},'Hungary':{},'Iceland':{},'India':{},'Indonesia':{},'Iran':{},'Iraq':{},'Ireland':{},'Israel':{},
'Italy':{},'Jamaica':{},'Japan':{},'Jordan':{},'Kazakhstan':{},'Kuwait':{},'Kenya':{},'Kiribati':{},'South Korea':{},'Kuwait':{},'Kyrgyzstan':{},"Laos":{},'Latvia':{},'Lebanon':{},'Lesotho':{},'Liberia':{},'Libya':{},'Liechtenstein':{},'Lithuania':{},'Luxembourg':{},'Madagascar':{},'Malawi':{},
'Malaysia':{},'Maldives':{},'Mali':{},'Marshall Islands':{},'Malta':{},'Mauritania':{},'Mauritius':{},'Mexico':{},'Micronesia':{},'Moldova':{},'Monaco':{},'Mongolia':{},'Montenegro':{},'Morocco':{},'Mozambique':{},'Myanmar':{},'Namibia':{},'Nauru':{},'Nepal':{},
'Netherlands':{},'New Zealand':{},'Nicaragua':{},'Niger':{}, 'New Caledonia': {}, 'Nigeria':{},'Macedonia':{},'Norway':{},'Oman':{},'Pakistan':{},'Palau':{},'Panama':{},'Papua New Guinea':{},'Paraguay':{},'Peru':{},'Philippines':{},'Poland':{},'Portugal':{},'Qatar':{},'Romania':{},'Russia':{},'Rwanda':{},'Saint Kitts and Nevis':{},
'Saint Lucia':{},'Saint Vincent and the Grenadines':{},'Samoa':{},'San Marino':{},'Sao Tome and Principe':{},'Saudi Arabia':{},'Senegal':{},'Serbia':{},'Seychelles':{},'Sierra Leone':{},'Singapore':{},'Slovakia':{},'Slovenia':{},'Solomon Islands':{},'Somalia':{},'South Africa':{},'South Sudan':{},'Spain':{},'Sri Lanka':{},'Sudan':{},'Suriname':{},'Sweden':{},
'Switzerland':{},'eSwatini':{}, 'Palestine':{}, 'Syria':{},'Tajikistan':{},'Tanzania':{}, 'Taiwan':{}, 'Thailand':{},'Timor-Leste':{},'Togo':{},'Tonga':{},'Trinidad and Tobago':{},'Tunisia':{},'Turkey':{},'Turkmenistan':{},'Tuvalu':{},'Uganda':{},'Ukraine':{},'United Arab Emirates':{},'United Kingdom':{},'United States of America':{},'Uruguay':{},'Uzbekistan':{},'Vanuatu':{},'Venezuela':{},
'Vietnam':{},'Western Sahara':{},'Yemen':{},'Zambia':{}, 'Zimbabwe': {}, 'Kosovo': {}, 'korea-north' :{}}
var parsedData;


//console.log(new Date(new Date().toLocaleDateString("en-US", {timezone: "UTC"})));
var DictFromSave;

function getFromSave1(){
  return new Promise ((resolve, reject) => fs.readFile("countryDict.txt", (err, data)=>{
      if(err) console.log(err);
      else{ 
          DictFromSave = JSON.parse(data);
          console.log('File read.');
          return resolve();
      }
      return;
  }));
}

var diffArray = [['Western Sahara', 'W. Sahara'],['Bosnia and Herzegovina', 'Bosnia and Herz.'],
['Central African Republic', 'Central African Rep.'],['Republic of the Congo', 'Congo'],['Equatorial Guinea', 'Eq. Guinea'],
['korea-north', 'North Korea'],['Solomon Islands', 'Solomon Is.'],['South Sudan', 'S. Sudan'], ['CI', "Côte d'Ivoire"], 
['Dominican Republic', 'Dominican Rep.'] , ['Democratic Republic of the Congo', 'Dem. Rep. Congo']];

async function getFromSave(){
  await getFromSave1();
  for(var i = 0; i<diffArray.length;i++ ){
    DictFromSave[diffArray[i][1]] = DictFromSave[diffArray[i][0]];
    delete DictFromSave[diffArray[i][0]];
  }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

function doRequest(key) {
    tempURL = 'https://api.covid19api.com/total/dayone/country/'+key+'/status/confirmed';
    return new Promise ((resolve, reject) => {
      let req = https.get(tempURL, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                parsedData = JSON.parse(rawData);
                for(var i = 0; i <parsedData.length; i++){
                    countryDict[key][parsedData[i].Date] = {'Cases': parsedData[i].Cases};
                }
            } catch (e) {
            console.error(e.message);
            }
        });
        }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
  
      req.on('response', res => {
        resolve(res);
      });
  
      req.on('error', err => {
        reject(err);
      });
    }); 
  }

  function doRequest2(key) {
    tempURL2 = 'https://api.covid19api.com/total/dayone/country/'+key+'/status/deaths';
    return new Promise ((resolve, reject) => {
      let req =   https.get(tempURL2, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                parsedData = JSON.parse(rawData);
                for(var i = 0; i <parsedData.length; i++){
                    countryDict[key][parsedData[i].Date]['Deaths'] = parsedData[i].Cases;
                }
            } catch (e) {
            console.error(e.message);
            }
        });
        }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
  
      req.on('response', res => {
        resolve(res);
      });
  
      req.on('error', err => {
        reject(err);
      });
    }); 
  }

  function doRequest3(key) {
    tempURL2 = 'https://api.covid19api.com/total/dayone/country/'+key+'/status/recovered';
    return new Promise ((resolve, reject) => {
      let req =   https.get(tempURL2, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                parsedData = JSON.parse(rawData);
                for(var i = 0; i <parsedData.length; i++){
                    countryDict[key][parsedData[i].Date]['Recovered'] = parsedData[i].Cases;
                    countryDict[key][parsedData[i].Date]['Active'] = countryDict[key][parsedData[i].Date]['Cases'] - countryDict[key][parsedData[i].Date]['Deaths'] - parsedData[i].Cases;
                }
            } catch (e) {
            console.error(e.message);
            }
        });
        }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
  
      req.on('response', res => {
        resolve(res);
      });
  
      req.on('error', err => {
        reject(err);
      });
    }); 
  }

async function getData(){

    for(var key in countryDict){
        console.log(key);
        await doRequest(key);
        await doRequest2(key);
        await doRequest3(key);
    }
    fs.writeFile("countryDict.txt", JSON.stringify(countryDict), 'binary', (err)=>{
        if(err) console.log(err)
        else console.log('File saved')
     });
} 


async function getTotalData(){
  await getData();
  await getFromSave();
}



var max = 0;


 function getMaxCases(){
    var temp = 0;
    var temp1;
    for(var key in DictFromSave){
      for(var i in DictFromSave[key]){
        if(DictFromSave[key][i].Active > max)
          max = DictFromSave[key][i].Active;
      }
      if(key == "C�te d'Ivoire"){
        DictFromSave["Côte d'Ivoire"] = DictFromSave["C�te d'Ivoire"];
        delete DictFromSave["C�te d'Ivoire"];
      }
    }
    
}


async function getMaxCases2(){
  await getFromSave();
  getMaxCases();
}

getMaxCases2();


schedule.scheduleJob({hour: 00, minute: 00}, async function(){
  await getData();
  await getMaxCases2();
  today = new Date(new Date().toUTCString());
  diff = Math.floor((today.getTime()- firstD.getTime())/(1000*3600*24));
  todayString = today.toDateString();

})


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index', {totalDays: diff+1, todayString: todayString, cd: JSON.stringify(DictFromSave), max : JSON.stringify(max)});
});

app.listen(port, () => console.log(`Starting on port ${port}!`));