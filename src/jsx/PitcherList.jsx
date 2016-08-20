import React from 'react';
import PitcherDetails from './PitcherDetails.jsx';

const PitcherList = React.createClass({

    getInitialState: function() {
        return {
            pitcherProjections: [],
            pitcherDetails: [],
            pitcherNodes: []
        }
    },

    handlePlayerClick: function(event) {
        debugger;
        this.props.onPlayerClick(event.target.id);

    },

    skipClickDelay: function(event) {
        event.preventDefault();
        event.target.click();
    },



    render: function() {

        let i = 0;
        let pitcherNodes = this.props.pitcherNodes.map((pitcher) => {
            ++i;
            /*this.setState({
                chosenProjections: this.props.pitcherProjections['pitcher' + pitcher.PlayerID],
                chosenDetails: this.props.pitcherDetails['pitcher' + pitcher.PlayerID]
            });*/
            debugger;
            
            return (
                <tr
                   key={pitcher.PlayerID}
                   className="player-header"
                   aria-expanded="false"
                   aria-controls={'accordion' + i}
                >
                     <td className="td-name"
                         id={pitcher.PlayerID}
                         onClick={this.handlePlayerClick}>
                         {pitcher.Name}

                         <PitcherDetails
                             chosenProjections = {this.props.pitcherProjections['pitcher' + pitcher.PlayerID]}
                             chosenDetails = {this.props.pitcherDetails['pitcher' + pitcher.PlayerID]}
                         />

                     </td>
                     <td className="td-total-score"
                         style={{backgroundColor: pitcher.TotalScoreColor,
                         textAlign: "center"}}>{pitcher.TotalScore}
                     </td>
                </tr>

            );
        });

        return (
            <div id="pitcher-list">
                <table id="pitcher-list-table">
                    <thead>
                        <tr>
                            <th className="th-name">Name</th>
                            <th className="th-score">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pitcherNodes}
                    </tbody>
                </table>
            </div>


        );
    }
});

module.exports = PitcherList;
