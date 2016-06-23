import React from 'react'
import ReactDOM from 'react-dom';
import PitcherList from './PitcherList.jsx';
import PitcherDetails from './PitcherDetails.jsx';

const dateObj = new Date();
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const day = dateObj.getDate();
const month = monthNames[dateObj.getMonth()];
const season = dateObj.getFullYear();
const date = `${season}-${month}-${day}`;
const fantasyDataKey = '67f93ffa433b4254ae2207537e071134';
const fantasyDataUrl = 'https://api.fantasydata.net/mlb/v2/json';
const boxScoresUrl = fantasyDataUrl + '/BoxScores/' + date;
const pitcherDetailsUrl = fantasyDataUrl + '/Player/';
const pitcherStatsUrl = `${fantasyDataUrl}/PlayerSeasonStatsByPlayer/${season}/`;
const dailyLineupsUrl = `${fantasyDataUrl}/PlayerGameProjectionStatsByDate/${date}`;
const jsonp = require('jsonp-es6');
const jsonpParams = { key: fantasyDataKey };
const hexRed = '#DD0000';
const hexYellow = '#DDDD00';
const hexGreen = '#00BB00';

let pitcherProjections = [], pitcherDetails = [], pitcherStats = [], pitcherNodes = [];

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
    getJSON: function(url, callback) {
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
        };
        request.send();
    },

    // Load daily lineups feed
    loadDailyLineups: function() {
        this.dailyLineupsRequest = this.getJSONP(this.props.dailyLineupsUrl, jsonpParams,
                this.handleDailyLineupsResponse);
    },

    // Process the daily lineups data
    handleDailyLineupsResponse: function(response) {
        for (let item of response) {

            // If the player is a pitcher and will pitch today
            if ((item.Position === "SP" || item.Position === "P") && item.FantasyPoints > 0) {

                // Calculate the pitcher's score
                let [totalScore, totalScoreColor] = this.calculateScore(item);
                item.TotalScore = totalScore;
                item.TotalScoreColor = totalScoreColor;

                // Store data
                pitcherNodes.push(item);
                pitcherProjections['pitcher' + item.PlayerID] = item;

                // Sort pitcher list by last name
                pitcherNodes = _.sortBy(pitcherNodes, function(item) {
                    let names = item.Name.split(' ');
                    return names[1];
                });

                // Store data in state
                this.setState({pitcherProjections: pitcherProjections, pitcherNodes: pitcherNodes});

                // Load pitcher details for this player
                this.loadPitcherDetails(item.PlayerID);
            }
        }

    },

    // Get pitcher details from FantasyData
    loadPitcherDetails: function(pitcherId) {
        this.getJSONP(pitcherDetailsUrl + pitcherId, jsonpParams, this.handlePitcherDetailsResponse);
        this.getJSONP(pitcherStatsUrl + pitcherId, jsonpParams, this.handlePitcherStatsResponse);

    },

    // Process player details for each pitcher
    handlePitcherDetailsResponse: function(response) {
        pitcherDetails['pitcher' + response.PlayerID] = response;
        this.setState({pitcherDetails: pitcherDetails});
        //console.log('pitcherDetails', pitcherDetails);
    },

    // Process player stats for each pitcher
    handlePitcherStatsResponse: function(response) {
        pitcherStats['pitcher' + response.PlayerID] = response;
        this.setState({pitcherStats: pitcherStats});
        //console.log('pitcherStats', pitcherStats);
    },

    // Create a score for each pitcher, based on various feeds' fantasy point projections
    calculateScore: function(item) {
        let fp = item.FantasyPoints * 5,
            fpdk = item.FantasyPointsDraftKings,
            fpfd = item.FantasyPointsFanDuel,
            fpy = item.FantasyPointsYahoo;
        let total = parseInt(fp + fpdk + fpfd + fpy);
        let color;
        if (total >= 100) {
            color = hexGreen;
        } else if (total > 90) {
            color = hexYellow;
        } else {
            color = hexRed;
        }
        return [total, color];
    },

    // When the user clicks a new player, we need to change the state so the view can re-render
    handlePlayerClick: function(playerId) {
        this.setState({
             chosenProjections: this.state.pitcherProjections['pitcher' + playerId],
             chosenDetails: this.state.pitcherDetails['pitcher' + playerId]
        });
        var el = document.querySelector('#pitcher-details');
        this.fadeIn(el);
        
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

    // Generic fade-in effet for the PlayerDetails panel
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
        return (
            <div id="pitch-or-perch">
                <h1>Pitch or Perch9</h1>
                <h2>{date}</h2>
                <div className="components">
                    <PitcherList
                        pitcherProjections = {this.state.pitcherProjections}
                        pitcherDetails = {this.state.pitcherDetails}
                        pitcherNodes = {this.state.pitcherNodes}
                        onPlayerClick = {this.handlePlayerClick}
                    />
                    <PitcherDetails
                        chosenProjections = {this.state.chosenProjections}
                        chosenDetails = {this.state.chosenDetails}
                    />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <PitchOrPerch boxScoresUrl={boxScoresUrl} dailyLineupsUrl={dailyLineupsUrl} />,
    document.getElementById('app')
);
