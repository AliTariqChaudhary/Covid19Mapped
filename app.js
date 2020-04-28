const express = require('express')
const app = express();
const covid19api = require('covid19-api');
const ejs = require('ejs');
const https = require('https');
var fs = require('fs');


//firt date is 2020-01-22T00:00:00Z
var firstD = new Date('January 22, 2020 00:00:00 GMT+00:00');
var today = new Date(new Date().toUTCString());
diff = Math.floor((today.getTime()- firstD.getTime())/(1000*3600*24));
todayString = today.toDateString();

var countryDict = {'AF':{}, 'AL':{},'DZ':{}/*,'AD':{},'AO':{},'AG':{},'AR':{},'AM':{},'AU':{},'AT':{},'AZ':{},'BS':{},'BH':{},'BD':{},'BB':{},'BY':{},'BE':{},
'BZ':{},'BJ':{},'BT':{},'BO':{},'BA':{},'BW':{},'BR':{},'BN':{},'BG':{},'BF':{},'BI':{},'CV':{},'KH':{},'CM':{},'CA':{},'CF':{},'TD':{},'CL':{},'CN':{},'CO':{},'KM':{},'CG':{},
'CD':{},'CR':{},'CI':{},'HR':{},'CU':{},'CY':{},'CZ':{},'DK':{},'DJ':{},'DM':{},'DO':{},'EC':{},'EG':{},'SV':{},'EQ':{},'ER':{},'EE':{},'SZ':{},'ET':{},'FJ':{},'FI':{},'FR':{},
'GA':{},'GM':{},'GE':{},'DE':{},'GH':{},'GR':{},'GD':{},'GT':{},'GN':{},'GW':{},'GY':{},'HT':{},'VA':{},'HN':{},'HU':{},'IS':{},'IN':{},'ID':{},'IR':{},'IQ':{},'IE':{},'IL':{},
'IT':{},'JM':{},'JP':{},'JM':{},'JP':{},'JP':{},'JO':{},'KZ':{},'KE':{},'KI':{},'KP':{},'KR':{},'KW':{},'KG':{},'LA':{},'LV':{},'LB':{},'LS':{},'LR':{},'LY':{},'LI':{},'LT':{},
'LU':{},'MG':{},'MW':{},'MY':{},'MV':{},'ML':{},'MT':{},'MH':{},'MR':{},'MU':{},'MX':{},'FM':{},'MD':{},'MC':{},'MN':{},'ME':{},'MA':{},'MZ':{},'MM':{},'NA':{},'NR':{},'NP':{},
'NL':{},'NZ':{},'NI':{},'NE':{},'NG':{},'MK':{},'NO':{},'OM':{},'PK':{},'PW':{},'PA':{},'PG':{},'PY':{},'PE':{},'PH':{},'PL':{},'PT':{},'QA':{},'RO':{},'RU':{},'RW':{},'KN':{},
'LC':{},'VC':{},'WS':{},'SM':{},'ST':{},'SA':{},'SN':{},'RS':{},'SC':{},'SL':{},'SG':{},'SK':{},'SI':{},'SB':{},'SO':{},'ZA':{},'SS':{},'ES':{},'LK':{},'SD':{},'SR':{},'SE':{},
'CH':{},'SY':{},'TJ':{},'TZ':{},'TH':{},'TL':{},'TG':{},'TO':{},'TT':{},'TN':{},'TR':{},'TM':{},'TV':{},'UG':{},'UA':{},'AE':{},'GB':{},'US':{},'UY':{},'UZ':{},'VU':{},'VE':{},
'VN':{},'YE':{},'ZM':{}*/}
var parsedData;


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

function doRequest(key) {
    tempURL = 'https://api.covid19api.com/total/dayone/country/'+key+'/status/confirmed';
    tempURL2 = 'https://api.covid19api.com/total/dayone/country/'+key+'/status/deaths';
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

async function getData(){

    for(var key in countryDict){
        await doRequest(key);
        await doRequest2(key);
    }
} 

//getData();



app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    /*fs.writeFile("countryDict.txt", JSON.stringify(countryDict), 'binary', (err)=>{
        if(err) console.log(err)
        else console.log('File saved')
     })*/
    res.render('index', {totalDays: diff+1, todayString: todayString});
});

app.listen(3000, () => {
  console.log('Started on port 3000.')
});