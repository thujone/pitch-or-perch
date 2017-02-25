import React from 'react'
import ReactDOM from 'react-dom';
import PitcherList from './PitcherList.jsx';


const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const monthNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



//let dateObject = new Date();
let dateObject = new Date("September 30, 2016 10:00:00");
const pad = function (str, len = 2, padChar = '0', prepend = true) {
    str += '';
    let padLength = len - str.length;
    if (padLength) {
        for (let item of [...Array(padLength).keys()]) {
            if (prepend) {
                str = padChar + str;
            } else {
                str += padChar;
            }
        }
    }
    return str;
};
let today = {
    label: 'today',
    day: dateObject.getDate(),
    month: monthNames[dateObject.getMonth()],
    numeralMonth: monthNumbers[dateObject.getMonth()],
    season: dateObject.getFullYear(),
    dayOfWeek: dayNames[dateObject.getDay()]
};
today.dateString = `${today.season}-${today.month}-${pad(today.day)}`;
today.altDateString = `${today.season}-${today.numeralMonth}-${pad(today.day)}`;

console.log("Today: " + today.dateString);

//let tomorrowDateObject = new Date();
let tomorrowDateObject = new Date("October 1, 2016 10:00:00");
tomorrowDateObject.setDate(tomorrowDateObject.getDate());
let tomorrow = {
    label: '',
    day: tomorrowDateObject.getDate(),
    month: monthNames[tomorrowDateObject.getMonth()],
    numeralMonth: monthNumbers[dateObject.getMonth()],
    season: tomorrowDateObject.getFullYear(),
    dayOfWeek: dayNames[tomorrowDateObject.getDay()]
};
tomorrow.dateString = `${tomorrow.season}-${tomorrow.month}-${pad(tomorrow.day)}`;
tomorrow.altDateString = `${tomorrow.season}-${tomorrow.numeralMonth}-${pad(tomorrow.day)}`;

//let twoDaysDateObject = new Date();
let twoDaysDateObject = new Date("October 2, 2016 10:00:00");
twoDaysDateObject.setDate(twoDaysDateObject.getDate());
let twoDays = {
    label: '',
    day: twoDaysDateObject.getDate(),
    month: monthNames[twoDaysDateObject.getMonth()],
    numeralMonth: monthNumbers[dateObject.getMonth()],
    season: twoDaysDateObject.getFullYear(),
    dayOfWeek: dayNames[twoDaysDateObject.getDay()]
};
twoDays.dateString = `${twoDays.season}-${twoDays.month}-${pad(twoDays.day)}`;
twoDays.altDateString = `${twoDays.season}-${twoDays.numeralMonth}-${pad(twoDays.day)}`;

let selectedDate = today; // This changes if the user changes the date pulldown
const dates = [today, tomorrow, twoDays];
const fantasyDataKey = '0c777943c21e4f4c934f933ea3940fad';
const fantasyDataUrl = 'https://api.fantasydata.net/mlb/v2/json';
const getPitcherDetailsUrl = function(pitcherId) {
    return `${fantasyDataUrl}/Player/${pitcherId}`;
};
const getPitcherStatsUrl = function(season, pitcherId) {
    return `${fantasyDataUrl}/PlayerSeasonStatsByPlayer/${season}/${pitcherId}`;
};
const getDailyLineupsUrl = function(date) {
    return `${fantasyDataUrl}/PlayerGameProjectionStatsByDate/${date.dateString}`;
};

const jsonp = require('jsonp-es6');
const jsonpParams = { key: fantasyDataKey };
const hexRed = '#DD0000';
const hexYellow = '#DDDD00';
const hexGreen = '#00BB00';

let pitcherProjections = [],
    pitcherDetails = [],
    pitcherStats = [],
    pitcherNodes = [],
    detailsLoaded = 0,
    statsLoaded = 0;

// Entry point for the "Pitch or Perch" fantasy baseball app
const PitchOrPerch = React.createClass({

    // Initial state for the app
    getInitialState: function() {
        return {
            pitcherProjections: [],  // Projections for all probable pitchers in the FantasyData feed
            pitcherDetails: [],      // Player details for all probable pitchers
            pitcherStats: [],        // Current 2016 stats for all probably pitchers
            pitcherNodes: [],        // HTML nodes for all pitchers
            chosenProjections: [],   // Currently-selected pitcher's projections
            chosenDetails: []        // Currently-selected pitcher's details
        }
    },

    // Fetch the FantasyData Daily Lineups json
    componentDidMount: function() {
        this.loadDailyLineups();
    },

    // Clean up on unmount
    componentWillUnmount: function() {
        this.dailyLineupsRequest.abort();
    },

    // Return JSONP from any URL and run the defined callback
    getJSONP: function(url, params, callback) {
        jsonp(url, params).then((result) => {
            callback(result);
        });
    },

    // Return JSON
    getJSON: function(url, callback, failback) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Ocp-Apim-Subscription-Key', fantasyDataKey);
        request.onload = function(error) {
            if (request.status >= 200 && request.status < 400) {
                callback(JSON.parse(request.responseText));
            } else {
                console.log('Server error', error);
            }
        };
        request.onerror = function(error) {
            console.log('Request error', error);
            if (failback) failback(error);
        };
        request.send();
    },

    // Load daily lineups feed
    loadDailyLineups: function() {
        this.dailyLineupsRequest = this.getJSONP(getDailyLineupsUrl(selectedDate), jsonpParams,
            this.handleDailyLineupsResponse);
    },

    // Process the daily lineups data
    handleDailyLineupsResponse: function(response) {
        let root = this;
        pitcherNodes = [];
        for (let item of response) {

            // If the player is a pitcher and will pitch today
            if (
                (item['Position'] === "SP" || item['Position'] === "P") &&
                item['FantasyPoints'] > 0 &&
                item['DateTime'].indexOf(selectedDate.altDateString) > -1
            ) {
                // Calculate the pitcher's score
                let [totalScore, totalScoreColor] = this.calculateScore(item);
                item.TotalScore = totalScore;
                item.TotalScoreColor = totalScoreColor;

                // Store data
                pitcherNodes.push(item);
                pitcherProjections['pitcher' + item['PlayerID']] = item;
                pitcherProjections[item['Name']] = item;
            }
        }

        // Sort pitcher list by last name
        pitcherNodes = _.sortBy(pitcherNodes, function(item) {
            let names = item.Name.split(' ');
            return names[1];
        });

        console.log('pitcherNodes', pitcherNodes);

        let getDetails = function () {
            // Load pitcher details for this player
            pitcherNodes.forEach(function (i) { root.loadPitcherDetails(i['PlayerID']); }, root);
        };

        // look for any overrides for the days we're projecting
        let getOverrides = function(obj) {
            // resolve list of overrides
            for (var pitcher in obj) {
                var projIndex = pitcherNodes.indexOf(pitcherProjections[pitcher]);
                if (projIndex == -1) continue;
                if (obj[pitcher]['active'] == false) pitcherNodes.splice(projIndex, 1);
                if (obj[pitcher]['score']){
                    pitcherNodes[projIndex].TotalScore = obj[pitcher]['score'];
                    pitcherNodes[projIndex].TotalScoreColor = root.getScoreColor(obj[pitcher]['score']);
                }
            }
            // load details with updated values
            getDetails();
        };

        this.getJSON('overrides/' + selectedDate.dateString + '.json', getOverrides, getDetails);
    },

    // Get pitcher detailsx from FantasyData
    loadPitcherDetails: function(pitcherId) {
        this.getJSONP(getPitcherDetailsUrl(pitcherId), jsonpParams, this.handlePitcherDetailsResponse);
        this.getJSONP(getPitcherStatsUrl(selectedDate.season, pitcherId), jsonpParams, this.handlePitcherStatsResponse);
    },

    // Process player details for each pitcher
    handlePitcherDetailsResponse: function(response) {
        pitcherDetails['pitcher' + response.PlayerID] = response;
        detailsLoaded ++;
        this.checkDataLoadComplete();
        //console.log('pitcherDetails', pitcherDetails);
    },

    // Process player stats for each pitcher
    handlePitcherStatsResponse: function(response) {
        pitcherStats['pitcher' + response.PlayerID] = response;
        statsLoaded ++;
        this.checkDataLoadComplete();
        //console.log('pitcherStats', pitcherStats);
    },

    checkDataLoadComplete: function() {
        if (detailsLoaded == pitcherNodes.length &&
            statsLoaded == pitcherNodes.length) {
            // all data loaded
            this.setState({ pitcherProjections: pitcherProjections,
                            pitcherNodes: pitcherNodes,
                            pitcherDetails: pitcherDetails,
                            pitcherStats: pitcherStats
            });
        }
    },

    getScoreColor: function(score) {
        let color;
        if (score >= 100) {
            color = hexGreen;
        } else if (score > 85) {
            color = hexYellow;
        } else {
            color = hexRed;
        }
        return color;
    },

    // Create a score for each pitcher, based on various feeds' fantasy point projections
    calculateScore: function(item) {
        let fp = item.FantasyPoints * 5,
            fpdk = item.FantasyPointsDraftKings,
            fpfd = item.FantasyPointsFanDuel,
            fpy = item.FantasyPointsYahoo;
        let total = parseInt(fp + fpdk + fpfd + fpy);

        return [total, this.getScoreColor(total)];
    },

    // When the user clicks a new player, we need to change the state so the view can re-render
    handlePlayerClick: function(playerId) {
        this.setState({
            chosenProjections: this.state.pitcherProjections['pitcher' + playerId],
            chosenDetails: this.state.pitcherDetails['pitcher' + playerId]
        });
        //var el = document.querySelector('#pitcher-details');
        //this.fadeIn(el);
        document.getElementById(playerId).appendChild(document.getElementById('pitcher-details'));

    },

    handleDateSelect: function(event) {
        let chosenDate = _.find(dates, {'dateString': event.target.value});
        selectedDate = chosenDate;
        this.setState({
            pitcherProjections: [],
            pitcherDetails: [],
            pitcherStats: [],
            pitcherNodes: []
        });
        var el = document.querySelector('#pitcher-details');
        this.fadeOut(el);
        this.loadDailyLineups();
    },

    // Generic fade-out effect for the PlayerDetails panel
    fadeOut: function(el) {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= .05) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    },

    // Generic fade-in effect for the PlayerDetails panel
    fadeIn: function(el, display="block") {
        el.style.opacity = 0;
        el.style.display = display;
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .05) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    },

    render: function() {
        let dateSelectorOptions = dates.map((date) => {
            return (
                <option key={date.dateString} value={date.dateString}>
                    {date.dateString} {date.label ? `(${date.label})` : ''}
                </option>
            );
        });

        return (
            <div id="pitch-or-perch">
                <h1>Pitch or Perch9</h1>
                <div className="components">
                    <select id="date-selector" value={selectedDate.dateString} onChange={this.handleDateSelect}>
                        {dateSelectorOptions}
                    </select>
                    <PitcherList
                        pitcherProjections = {this.state.pitcherProjections}
                        pitcherDetails = {this.state.pitcherDetails}
                        pitcherNodes = {this.state.pitcherNodes}
                        pitcherStats = {this.state.pitcherStats}
                        onPlayerClick = {this.handlePlayerClick}
                        chosenProjections = {this.state.chosenProjections}
                        chosenDetails = {this.state.chosenDetails}
                    />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <PitchOrPerch />,
    document.getElementById('app')
);
