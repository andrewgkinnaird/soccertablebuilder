let axios = require('axios');


const  getData = (competition,dates) => {
    require("dotenv").config();
    return new Promise((resolve,reject) => {
        //let day = date.getDate();
        //let month = date.getMonth() + 1;
        // year = date.getFullYear();

        // dateString = `${year}-${("0"+month).slice(-2)}-${("0"+day).slice(-2)}`; //ensures that leading zeros are included in month and day

        let config = {
            method: 'get',
            url: `https://v3.football.api-sports.io/fixtures?season=2023&league=39`,
            headers: {
                'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        };

        axios(config)
        .then(function (response) {
            //thirdPartyAPiCallsRemaining = response.headers["x-ratelimit-requests-remaining"];
            //systemEventLog.log(`${response.data.response.length} games retrieved from 3rd-party site. ${thirdPartyAPiCallsRemaining} api calls remaining.`);
           
            return resolve(response.data.response);
        })
        .catch(function (error) {
            console.error(error);
            //errorLog.log(`${error} occured in makeAPIcall().`);
        });
    })
    
}   

exports.getData = getData;

    

    