const express = require('express')
const app = express();
const covid19api = require('covid19-api');
const ejs = require('ejs');
const https = require('https');
var fs = require('fs');
const d3 = require('d3');
const favicon = require('express-favicon');
const schedule = require('node-schedule')
const port = process.env.PORT || 3000;

//firt date is 2020-01-22T00:00:00Z

//app.use(favicon(__dirname + '/views/images/favicon.png'));


var firstD = new Date('January 22, 2020');
var today = new Date('August 20, 2022');
console.log((today.getTime() - firstD.getTime()) / (1000 * 3600 * 24));
diff = Math.floor((today.getTime() - firstD.getTime()) / (1000 * 3600 * 24));
todayString = today.toDateString();

var countryDict = {
  'Afghanistan': {}, 'Antarctica': {}, 'Albania': {}, 'Algeria': {}, 'Andorra': {}, 'Angola': {}, 'Antigua and Barbuda': {}, 'Argentina': {}, 'Armenia': {}, 'Australia': {}, 'Austria': {}, 'Azerbaijan': {}, 'Bahamas': {}, 'Bahrain': {}, 'Bangladesh': {}, 'Barbados': {}, 'Belarus': {}, 'Belgium': {},
  'Belize': {}, 'Benin': {}, 'Bhutan': {}, 'Bolivia': {}, 'Bosnia and Herzegovina': {}, 'Botswana': {}, 'Brazil': {}, 'Brunei': {}, 'Bulgaria': {}, 'Burkina Faso': {}, 'Burundi': {}, 'Cabo Verde': {}, 'Cambodia': {}, 'Cameroon': {}, 'Canada': {}, 'Central African Republic': {}, 'Chad': {}, 'Chile': {}, 'China': {}, 'Colombia': {}, 'Comoros': {}, 'Republic of the Congo': {},
  'Democratic Republic of the Congo': {}, 'Costa Rica': {}, "CI": {}, 'Croatia': {}, 'Cuba': {}, 'Cyprus': {}, 'Czechia': {}, 'Denmark': {}, 'Djibouti': {}, 'Dominica': {}, 'Dominican Republic': {}, 'Ecuador': {}, 'Egypt': {}, 'El Salvador': {}, 'Equatorial Guinea': {}, 'Eritrea': {}, 'Estonia': {}, 'Eswatini': {}, 'Ethiopia': {}, 'Fiji': {}, 'Finland': {}, 'France': {},
  'Gabon': {}, 'Gambia': {}, 'Georgia': {}, 'Germany': {}, 'Ghana': {}, 'Greece': {}, 'Greenland': {}, 'Grenada': {}, 'Guatemala': {}, 'Guinea': {}, 'Guinea-Bissau': {}, 'Guyana': {}, 'Haiti': {}, 'Holy See': {}, 'Honduras': {}, 'Hungary': {}, 'Iceland': {}, 'India': {}, 'Indonesia': {}, 'Iran': {}, 'Iraq': {}, 'Ireland': {}, 'Israel': {},
  'Italy': {}, 'Jamaica': {}, 'Japan': {}, 'Jordan': {}, 'Kazakhstan': {}, 'Kuwait': {}, 'Kenya': {}, 'Kiribati': {}, 'South Korea': {}, 'Kuwait': {}, 'Kyrgyzstan': {}, "Laos": {}, 'Latvia': {}, 'Lebanon': {}, 'Lesotho': {}, 'Liberia': {}, 'Libya': {}, 'Liechtenstein': {}, 'Lithuania': {}, 'Luxembourg': {}, 'Madagascar': {}, 'Malawi': {},
  'Malaysia': {}, 'Maldives': {}, 'Mali': {}, 'Marshall Islands': {}, 'Malta': {}, 'Mauritania': {}, 'Mauritius': {}, 'Mexico': {}, 'Micronesia': {}, 'Moldova': {}, 'Monaco': {}, 'Mongolia': {}, 'Montenegro': {}, 'Morocco': {}, 'Mozambique': {}, 'Myanmar': {}, 'Namibia': {}, 'Nauru': {}, 'Nepal': {},
  'Netherlands': {}, 'New Zealand': {}, 'Nicaragua': {}, 'Niger': {}, 'New Caledonia': {}, 'Nigeria': {}, 'Macedonia': {}, 'Norway': {}, 'Oman': {}, 'Pakistan': {}, 'Palau': {}, 'Panama': {}, 'Papua New Guinea': {}, 'Paraguay': {}, 'Peru': {}, 'Philippines': {}, 'Poland': {}, 'Portugal': {}, 'Qatar': {}, 'Romania': {}, 'Russia': {}, 'Rwanda': {}, 'Saint Kitts and Nevis': {},
  'Saint Lucia': {}, 'Saint Vincent and the Grenadines': {}, 'Samoa': {}, 'San Marino': {}, 'Sao Tome and Principe': {}, 'Saudi Arabia': {}, 'Senegal': {}, 'Serbia': {}, 'Seychelles': {}, 'Sierra Leone': {}, 'Singapore': {}, 'Slovakia': {}, 'Slovenia': {}, 'Solomon Islands': {}, 'Somalia': {}, 'South Africa': {}, 'South Sudan': {}, 'Spain': {}, 'Sri Lanka': {}, 'Sudan': {}, 'Suriname': {}, 'Sweden': {},
  'Switzerland': {}, 'eSwatini': {}, 'Palestine': {}, 'Syria': {}, 'Tajikistan': {}, 'Tanzania': {}, 'Taiwan': {}, 'Thailand': {}, 'Timor-Leste': {}, 'Togo': {}, 'Tonga': {}, 'Trinidad and Tobago': {}, 'Tunisia': {}, 'Turkey': {}, 'Turkmenistan': {}, 'Tuvalu': {}, 'Uganda': {}, 'Ukraine': {}, 'United Arab Emirates': {}, 'United Kingdom': {}, 'United States of America': {}, 'Uruguay': {}, 'Uzbekistan': {}, 'Vanuatu': {}, 'Venezuela': {},
  'Vietnam': {}, 'Western Sahara': {}, 'Yemen': {}, 'Zambia': {}, 'Zimbabwe': {}, 'Kosovo': {}, 'korea-north': {}
}

var statesDict = {'Alabama' : {}, 'Alaska' : {},'Arizona' : {},'Colorado' : {},'Florida' : {},'Georgia' : {},'Indiana' : {},'Kansas' : {}, 'Maine' : {}, 'Massachusetts' : {}, 'Minnesota' : {}, 'New Jersey' : {}, 'North Carolina' : {}, 'North Dakota' : {}, 'Oklahoma' : {}, 'Pennsylvania' : {}, 'South Dakota' : {},  'Texas' : {}, 'Wyoming' : {}, 'Connecticut' : {}, 'Missouri' : {},
'West Virginia': {}, 'Illinois' : {}, 'New Mexico' : {}, 'Arkansas' : {}, 'California' : {}, 'Delaware' : {}, 'District of Columbia' : {}, 'Hawaii' : {}, 'Iowa' : {}, 'Kentucky' : {}, 'Maryland' : {}, 'Michigan' : {}, 'Mississippi' : {}, 'Montana' : {}, 'New Hampshire' : {}, 'New York' : {}, 'Ohio' : {}, 'Oregon' : {}, 'Tennessee' : {}, 'Utah' : {}, 'Virginia' : {}, 'Washington' : {}, 'Wisconsin' : {}, 'American Samoa' : {}, 'Guam' : {}, 'Northern Mariana Islands' : {},
'Nebraska' : {}, 'South Carolina' : {}, 'Puerto Rico' : {}, 'Virgin Islands' : {}, 'Idaho' : {}, 'Nevada' : {}, 'Vermont' : {}, 'Louisiana' : {}, 'Rhode Island': {}}

var popDict = {
  'Afghanistan': 35.530081, 'Albania': 2.930187, 'Algeria': 41.318142, 'Andorra': 0.076965, 'Angola': 29.784193, 'Antarctica': 0.0001, 'Antigua and Barbuda': 0.102012, 'Argentina': 44.271041, 'Armenia': 2.93045, 'Australia': 24.450561, 'Austria': 8.735453, 'Azerbaijan': 9.827589, 'Bahamas': 0.395361, 'Bahrain': 1.492584, 'Bangladesh': 164.669751, 'Barbados': 0.285719, 'Belarus': 9.468338, 'Belgium': 11.429336, 'Belize': 0.374681, 'Benin': 11.175692,
  'Bermuda': 0.061349, 'Bhutan': 0.80761, 'Bolivia': 11.0516, 'Bosnia and Herz.': 3.507017, 'Botswana': 2.291661, 'Brazil': 209.288278, 'Brunei': 0.428697, 'Bulgaria': 7.084571, 'Burkina Faso': 19.193382, 'Burundi': 10.864245, 'Cambodia': 16.005373, 'Cameroon': 24.053727, 'Canada': 36.624199, 'Central African Rep.': 4.65908, 'Chad': 14.899994, 'Chile': 18.054726, 'China': 1409.517397, 'Colombia': 49.065615, 'Comoros': 0.813912, 'Congo': 5.26075, 'Costa Rica': 4.905769,
  'Croatia': 4.189353, 'Cuba': 11.484636, 'Cyprus': 1.179551, 'Czechia': 10.618303, 'Denmark': 5.733551, 'Djibouti': 0.956985, 'Dominica': 0.073925, 'Dominican Rep.': 10.766998, 'Timor-Leste': 1.296311, 'Ecuador': 16.624858, 'Egypt': 97.553151, 'El Salvador': 6.377853, 'Eq. Guinea': 1.267689, 'Eritrea': 5.068831, 'Estonia': 1.309632, 'Ethiopia': 104.957438, 'Fiji': 0.905502, 'Finland': 5.523231, 'France': 64.979548, 'French Guiana': 0.282731, 'French Polynesia': 0.283007,
  'Gabon': 2.025137, 'Gambia': 2.100568, 'Georgia': 3.912061, 'Germany': 82.114224, 'Ghana': 28.833629, 'Greece': 11.159773, 'Greenland': 0.05648, 'Grenada': 0.107825, 'Guatemala': 16.913503, 'Guinea': 12.717176, 'Guinea-Bissau': 1.861283, 'Guyana': 0.777859, 'Haiti': 10.981229, 'Honduras': 9.265067, 'Hungary': 9.721559, 'Iceland': 0.335025, 'India': 1339.180127, 'Indonesia': 263.991379, 'Iran': 81.162788, 'Iraq': 38.274618, 'Ireland': 4.761657, 'Israel': 8.32157, 'Italy': 59.3599,
  "Côte d'Ivoire": 24.29475, 'Jamaica': 2.890299, 'Japan': 127.48445, 'Jordan': 9.702353, 'Kazakhstan': 18.204499, 'Kenya': 49.699862, 'Kiribati': 0.116398, 'Kuwait': 4.136528, 'Kyrgyzstan': 6.045117, 'Laos': 6.85816, 'Latvia': 1.94967, 'Lebanon': 6.082357, 'Lesotho': 2.233339, 'Liberia': 4.731906, 'Libya': 5.605, 'Liechtenstein': 0.037922, 'Lithuania': 2.890297, 'Luxembourg': 0.583455, 'Macedonia': 2.024, 'Madagascar': 25.570895, 'Malawi': 18.622104, 'Malaysia': 31.624264,
  'Maldives': 0.43633, 'Mali': 18.54198, 'Malta': 0.430835, 'Marshall Islands': 0.053127, 'Martinique': 0.384896, 'Mauritania': 4.420184, 'Mauritius': 1.265138, 'Mayotte': 0.253045, 'Mexico': 129.163276, 'Moldova': 4.051212, 'Monaco': 0.038695, 'Mongolia': 3.075647, 'Montenegro': 0.631219, 'Montserrat': 0.005177, 'Morocco': 35.73958, 'Mozambique': 29.668834, 'Myanmar': 53.370609, 'Namibia': 2.533794, 'Nauru': 0.011359, 'Nepal': 29.304998, 'Netherlands': 17.035938,
  'Netherlands Antilles': 0.217, 'New Caledonia': 0.276255, 'New Zealand': 4.705818, 'Nicaragua': 6.217581, 'Niger': 21.477348, 'Nigeria': 190.886311, 'Niue': 0.001618, 'Norfolk Island': 0.002, 'North Korea': 25.490965, 'Northern Mariana Islands': 0.055144, 'Norway': 5.305383, 'Oman': 4.636262, 'Pakistan': 197.015955, 'Palau': 0.021729, 'Palestine': 4.920724, 'Panama': 4.098587, 'Papua New Guinea': 8.251162, 'Paraguay': 6.811297, 'Peru': 32.165485, 'Philippines': 104.91809,
  'Poland': 38.170712, 'Portugal': 10.329506, 'Puerto Rico': 3.663131, 'Qatar': 2.639211, 'Reunion': 0.699, 'Romania': 19.679306, 'Russia': 143.989754, 'Rwanda': 12.208407, 'Saint Helena': 0.004049, 'Saint Kitts and Nevis': 0.055345, 'Saint Lucia': 0.178844, 'Saint Pierre and Miquelon': 0.00632, 'Saint Vincent and the Grenadines': 0.109897, 'Samoa': 0.19644, 'San Marino': 0.0334, 'Sao Tome and Principe': 0.204327, 'Saudi Arabia': 32.938213, 'Senegal': 15.850567, 'Seychelles': 0.094737,
  'Sierra Leone': 7.557212, 'Singapore': 5.708844, 'Slovakia': 5.447662, 'Slovenia': 2.079976, 'Solomon Is.': 0.611343, 'Somalia': 14.742523, 'South Africa': 56.717156, 'South Korea': 50.982212, 'S. Sudan': 12.575714, 'Spain': 46.354321, 'Sri Lanka': 20.876917, 'Sudan': 40.53333, 'Suriname': 0.563402, 'Svalbard and Jan Mayen': 0.0032, 'eSwatini': 1.008, 'Sweden': 9.910701, 'Switzerland': 8.476005, 'Syria': 18.269868, 'Tajikistan': 8.921343, 'Tanzania': 57.310019, 'Thailand': 69.037513,
  'Dem. Rep. Congo': 84.07, 'Togo': 7.797694, 'Tokelau': 0.0013, 'Tonga': 0.10802, 'Trinidad and Tobago': 1.369125, 'Tunisia': 11.532127, 'Turkey': 80.74502, 'Turkmenistan': 5.758075, 'Turks and Caicos Islands': 0.035446, 'Tuvalu': 0.011192, 'Uganda': 42.862958, 'Ukraine': 44.222947, 'United Arab Emirates': 9.400145, 'United Kingdom': 66.181585, 'United States of America': 324.459463, 'Uruguay': 3.45675, 'Uzbekistan': 31.910641, 'Vanuatu': 0.276244, 'Venezuela': 31.977065, 'Vietnam': 95.5408,
  'Wallis and Futuna': 0.011773, 'W. Sahara': 0.552628, 'Yemen': 28.25042, 'Yugoslavia': 10.64, 'Zambia': 17.09413, 'Zimbabwe': 16.529904, 'Serbia': 6.982, 'Kosovo': 1.845, 'Taiwan': 23.78
}

var statesPopDict = {'Alabama' : 4.903, 'Alaska' : 0.731 ,'Arizona' : 7.279 ,'Colorado' : 5.759,'Florida' : 21.48, 'Georgia' : 10.62,'Indiana' : 6.732,'Kansas' : 2.913, 'Maine' : 1.344, 'Massachusetts' : 6.893, 'Minnesota' : 5.64, 'New Jersey' : 8.882, 'North Carolina' : 10.49, 'North Dakota' : 0.762, 'Oklahoma' : 3.957, 'Pennsylvania' : 12.8 , 'South Dakota' : 0.884,  'Texas' : 29, 'Wyoming' : 0.578, 'Connecticut' : 3.565, 'Missouri' : 6.137,
'West Virginia': 1.792, 'Illinois' : 12.67, 'New Mexico' : 2.097, 'Arkansas' : 3.018, 'California' : 39.51, 'Delaware' : 0.973, 'District of Columbia' : 0.702, 'Hawaii' : 1.416, 'Iowa' : 3.155, 'Kentucky' : 4.468, 'Maryland' : 6.046, 'Michigan' : 9.987, 'Mississippi' : 2.976, 'Montana' : 1.069, 'New Hampshire' : 1.36, 'New York' : 19.45, 'Ohio' : 11.69, 'Oregon' : 4.218, 'Tennessee' : 6.829, 'Utah' : 3.206, 'Virginia' : 8.536, 'Washington' : 7.615, 'Wisconsin' : 5.822, 'American Samoa' : 0.055, 'Guam' : 0.165, 'Commonwealth of the Northern Mariana Islands' : 0.056,
'Nebraska' : 1.934, 'South Carolina' : 5.149, 'Puerto Rico' : 3.194, 'United States Virgin Islands' : 0.106, 'Idaho' : 1.787, 'Nevada' : 3.08, 'Vermont' : 0.623, 'Louisiana' : 4.649, 'Rhode Island': 1.059}

var parsedData;






//console.log(new Date(new Date().toLocaleDateString("en-US", {timezone: "UTC"})));
var DictFromSave;

function getFromSave1() {
  return new Promise((resolve, reject) => fs.readFile("countryDict.txt", (err, data) => {
    if (err) console.log(err);
    else {
      DictFromSave = JSON.parse(data);
      console.log('File read.');
      return resolve();
    }
    return;
  }));
}

function getFromSave2() {
  return new Promise((resolve, reject) => fs.readFile("countryDict.txt", (err, data) => {
    if (err) console.log(err);
    else {
      countryDict = JSON.parse(data);
      console.log('File read.');
      return resolve();
    }
    return;
  }));
}


var USDictFromSave;

function getUSFromSave1(){
      return new Promise((resolve, reject) => fs.readFile("statesDict.txt", (err, data) => {
      if (err) console.log(err);
      else {
        USDictFromSave = JSON.parse(data);
        for(var key in USDictFromSave){
          if(key == 'Northern Mariana Islands'){
            USDictFromSave['Commonwealth of the Northern Mariana Islands'] = USDictFromSave[key];
            delete USDictFromSave[key];
          }
          else if(key == 'Virgin Islands'){
            USDictFromSave['United States Virgin Islands'] = USDictFromSave[key];
            delete USDictFromSave[key];
          }
        }
        console.log('File read.');
        return resolve();
      }
      return;
    }));
  }



var diffArray = [['Western Sahara', 'W. Sahara'], ['Bosnia and Herzegovina', 'Bosnia and Herz.'],
['Central African Republic', 'Central African Rep.'], ['Republic of the Congo', 'Congo'], ['Equatorial Guinea', 'Eq. Guinea'],
['korea-north', 'North Korea'], ['Solomon Islands', 'Solomon Is.'], ['South Sudan', 'S. Sudan'], ['CI', "Côte d'Ivoire"],
['Dominican Republic', 'Dominican Rep.'], ['Democratic Republic of the Congo', 'Dem. Rep. Congo']];

async function getFromSave() {
  await getFromSave1();
  for (var i = 0; i < diffArray.length; i++) {
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
  tempURL = 'https://api.covid19api.com/total/dayone/country/' + key;
  return new Promise((resolve, reject) => {
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
          var booly = 0;
          parsedData = JSON.parse(rawData);
          for (var i = 0; i < parsedData.length; i++) {
            if(!countryDict[key][parsedData[i].Date])
              {
              countryDict[key][parsedData[i].Date] = { 'Cases': parsedData[i].Confirmed };
              countryDict[key][parsedData[i].Date]['Deaths'] = parsedData[i].Deaths;
              countryDict[key][parsedData[i].Date]['Recovered'] = parsedData[i].Recovered;
              countryDict[key][parsedData[i].Date]['Active'] = parsedData[i].Active;
            }
          }
          console.log(parsedData.length)
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

async function getData() {

  for (var key in countryDict) {
    console.log(key);
    await doRequest(key);
  }
  fs.writeFile("countryDict.txt", JSON.stringify(countryDict), 'binary', (err) => {
    if (err) console.log(err)
    else console.log('File saved')
  });
}



function doUSRequest() {
  tempURL = 'https://api.covid19api.com/dayone/country/united-states';
  return new Promise((resolve, reject) => {
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
          var booly = 0;
          parsedData = JSON.parse(rawData);
          for (var i = 0; i < parsedData.length; i++) {
            try{
              if(statesDict[parsedData[i].Province][parsedData[i].Date])
                {
                  statesDict[parsedData[i].Province][parsedData[i].Date]['Cases'] += parsedData[i].Confirmed ;
                  statesDict[parsedData[i].Province][parsedData[i].Date]['Deaths'] += parsedData[i].Deaths;
                  statesDict[parsedData[i].Province][parsedData[i].Date]['Recovered'] += parsedData[i].Recovered;  
                  statesDict[parsedData[i].Province][parsedData[i].Date]['Active'] += parsedData[i].Active;
                }
              else
              {
                statesDict[parsedData[i].Province][parsedData[i].Date] = { 'Cases': parsedData[i].Confirmed };
                statesDict[parsedData[i].Province][parsedData[i].Date]['Deaths'] = parsedData[i].Deaths;
                statesDict[parsedData[i].Province][parsedData[i].Date]['Recovered'] = parsedData[i].Recovered;
                statesDict[parsedData[i].Province][parsedData[i].Date]['Active'] = parsedData[i].Active;
              }
            }
            catch(e){
            }
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


async function getUSData() {
  await doUSRequest();
  await sleep(100000)
  fs.writeFile("statesDict.txt", JSON.stringify(statesDict), 'binary', (err) => {
    if (err) console.log(err)
    else console.log('File saved')
  });
}


async function getTotalData() {
  await getData();
  await getFromSave();
  await getUSData();
}


var max = 0;
var totmax = 0;

function getMaxCases() {
  return new Promise((resolve, reject) =>{
    var temp = 0;
    var temp1;
    for (var key in DictFromSave) {
      for (var i in DictFromSave[key]) {
        if(i != '2020-06-24T00:00:00Z'){
            if(DictFromSave[key][i].Active > totmax)
              totmax = DictFromSave[key][i].Active;
            if (key != 'San Marino')
              if (DictFromSave[key][i].Active / popDict[key] > max) {
                max = DictFromSave[key][i].Active / popDict[key];
              }
            }
      }
      if (key == "C�te d'Ivoire") {
        DictFromSave["Côte d'Ivoire"] = DictFromSave["C�te d'Ivoire"];
        delete DictFromSave["C�te d'Ivoire"];
      }
    }
    return resolve();
  });
}

var USTotMax=0;

function getUSMaxCases() {
  return new Promise((resolve, reject) =>{
    for (var key in USDictFromSave) {
      for (var i in USDictFromSave[key]) {
        if(USDictFromSave[key][i].Active > USTotMax)
          USTotMax = USDictFromSave[key][i].Active;
      }
    }
    return resolve();
  });
}


var DeathsDict = {};

function getDeathsbyDay() {
  DeathsDict = {};
  var tempkey;
  var booly = 0;
  for (var key in DictFromSave) {
    for (var i in DictFromSave[key]) {
      if (booly != 0) {
        DictFromSave[key][i]['NewDeaths'] = DictFromSave[key][i].Deaths - DictFromSave[key][tempkey].Deaths;
        if (!DeathsDict[i]) {
          DeathsDict[i] = DictFromSave[key][i].Deaths - DictFromSave[key][tempkey].Deaths;
        }
        else {
          DeathsDict[i] += DictFromSave[key][i].Deaths - DictFromSave[key][tempkey].Deaths;
        }
      }
      tempkey = i;
      booly = 1;
    }
    booly = 0;
  }
}

var USDeathsDict = {}

function getUSDeathsbyDay(){
  USDeathsDict = {}
  var tempkey;
  var booly = 0;
  for (var key in USDictFromSave) {
    for (var i in USDictFromSave[key]) {
      if (booly != 0) {
        USDictFromSave[key][i]['NewDeaths'] = USDictFromSave[key][i].Deaths - USDictFromSave[key][tempkey].Deaths;
        if (!USDeathsDict[i]) {
          USDeathsDict[i] = USDictFromSave[key][i].Deaths - USDictFromSave[key][tempkey].Deaths;
        }
        else {
          USDeathsDict[i] += USDictFromSave[key][i].Deaths - USDictFromSave[key][tempkey].Deaths;
        }
      }
      tempkey = i;
      booly = 1;
    }
    booly = 0;
  }
}

var InfectDict = {};

function getInfectbyDay() {
  InfectDict = {};
  var tempkey;
  var booly = 0;
  for (var key in DictFromSave) {
    for (var i in DictFromSave[key]) {
      if (booly != 0) {
        DictFromSave[key][i]['New Cases'] = DictFromSave[key][i].Cases - DictFromSave[key][tempkey].Cases;
        if (!InfectDict[i]) {
          InfectDict[i] = DictFromSave[key][i].Cases - DictFromSave[key][tempkey].Cases;
        }
        else {
          InfectDict[i] += DictFromSave[key][i].Cases - DictFromSave[key][tempkey].Cases;
        }
      }
      tempkey = i;
      booly = 1;
    }
    booly = 0;
  }
}

var USInfectDict = {};

function getUSInfectbyDay(){
  USInfectDict = {};
  var tempkey;
  var booly = 0;
  for (var key in USDictFromSave) {
    for (var i in USDictFromSave[key]) {
      if (booly != 0) {
        USDictFromSave[key][i]['New Cases'] = USDictFromSave[key][i].Cases - USDictFromSave[key][tempkey].Cases;
        if (!USInfectDict[i]) {
            USInfectDict[i] = USDictFromSave[key][i].Cases - USDictFromSave[key][tempkey].Cases;
        }
        else {
          USInfectDict[i] += USDictFromSave[key][i].Cases - USDictFromSave[key][tempkey].Cases;
        }
      }
      tempkey = i;
      booly = 1;
    }
    booly = 0;
  }
}

function getLogTotal(){
  var booly = 0
  var logT = 0;
  for(var key in DictFromSave){
    for(var i in DictFromSave[key]){
      if (DictFromSave[key][i].Active < 0.005 * totmax)
        logT = 3;
      else if (DictFromSave[key][i].Active < 0.03 * totmax)
        logT = 4;
      else if (DictFromSave[key][i].Active < 0.08 * totmax)
        logT = 9;
      else if (DictFromSave[key][i].Active < 0.13 * totmax)
       logT = 13;
      else if (DictFromSave[key][i].Active < 0.18 * totmax)
       logT = 18;
      else if (DictFromSave[key][i].Active < 0.24 * totmax)
        logT = 23;
      else if (DictFromSave[key][i].Active < 0.3 * totmax)
        logT = 28;
      else if (DictFromSave[key][i].Active < 0.5 * totmax)
        logT = 35;
      else if (DictFromSave[key][i].Active < 2 * totmax)
        logT = 40;
      DictFromSave[key][i]['Log Total'] = logT
    }
  }
}

async function getMaxCases2() {
  await getFromSave();
  await getMaxCases();
  getDeathsbyDay();
  getInfectbyDay();
  getLogTotal();
  await getUSFromSave1()
  await  getUSMaxCases();
  getUSDeathsbyDay()
  getUSInfectbyDay();
  console.log('Ready');
}



/*
schedule.scheduleJob({ hour: 00, minute: 00 }, async function () {
  await getFromSave2();
  await getData();
  await getUSData();
  await (sleep(100000))
  await getMaxCases2();
  today = new Date(new Date().toUTCString());
  console.log((today.getTime() - firstD.getTime()) / (1000 * 3600 * 24));
  diff += 1;
  todayString = today.toDateString();

})*/

async function everything() {
  await getFromSave2();
  await getData();
  await getUSData();
  await (sleep(500000))
  await getMaxCases2();
  today = new Date(new Date().toUTCString());
  console.log((today.getTime() - firstD.getTime()) / (1000 * 3600 * 24));
  diff += 1;
  todayString = today.toDateString();
}

//everything();
getMaxCases2();





app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  console.log(max);
  res.render('index', { totalDays: diff + 2, todayString: todayString, cd: JSON.stringify(DictFromSave), max: JSON.stringify(max), dD: JSON.stringify(DeathsDict), dead: 5, pD: JSON.stringify(popDict), iD: JSON.stringify(InfectDict) });
});

app.get('/total', (req, res) => {
  res.render('total', { totalDays: diff + 2, todayString: todayString, cd: JSON.stringify(DictFromSave), max: JSON.stringify(totmax), dD: JSON.stringify(DeathsDict), dead: 5, pD: JSON.stringify(popDict), iD: JSON.stringify(InfectDict) });
});

app.get('/totalbubble', (req, res) => {
  res.render('totalBubble', { totalDays: diff + 2, todayString: todayString, cd: JSON.stringify(DictFromSave), max: JSON.stringify(totmax), dD: JSON.stringify(DeathsDict), dead: 5, pD: JSON.stringify(popDict), iD: JSON.stringify(InfectDict) });
});

app.get('/US', (req, res) => {
  res.render('US', { totalDays: diff + 2, todayString: todayString, cd: JSON.stringify(USDictFromSave), max: JSON.stringify(max), dD: JSON.stringify(USDeathsDict), dead: 5, pD: JSON.stringify(statesPopDict), iD: JSON.stringify(USInfectDict) });
});

app.get('/totalUS', (req, res) => {
  res.render('USTotal', { totalDays: diff + 2, todayString: todayString, cd: JSON.stringify(USDictFromSave), max: JSON.stringify(USTotMax), dD: JSON.stringify(USDeathsDict), dead: 5, pD: JSON.stringify(popDict), iD: JSON.stringify(USInfectDict) });
});


app.use(function(req, res, next){
  res.status(404).send('No such page.');
});
app.listen(port, () => console.log(`Starting on port ${port}!`));