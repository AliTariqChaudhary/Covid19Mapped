Covid19 Tracker

Maps Covid19 for any given date.

The data is gotten from https://api.covid19api.com/ and is refreshed by a cron command every night at midnight my time(PDT). This API was chosen becuase it gives daily totals everyday since Jan 22nd in one array, therefore I only had to hit it once for every country everyday. The data is visualized with d3.js. The active cases per capita is a simple chloropleth map with 9 different shades of red plus a shade of gray for countries with no active reported cases. The total active cases is a bubble map. A challenge with the bubble map is slow load times, I was able to get it to be managable with some server side pre-calculations but still, it is regrettably slow on most machines. 

Software may be used by anyone.