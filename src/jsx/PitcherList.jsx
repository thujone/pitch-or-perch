import React from 'react';

const PitcherList = React.createClass({

    getInitialState: function() {
        return {
            pitcherProjections: [],
            pitcherDetails: [],
            pitcherNodes: []
        }
    },

    handlePlayerClick: function(event) {
        this.props.onPlayerClick(event.target.id);
    },

    render: function() {

        let pitcherNodes = this.props.pitcherNodes.map((pitcher) => {

            return (
               <tr
                   key={pitcher.PlayerID}
               >
                   <td className="td-name"
                       onClick={this.handlePlayerClick}
                       id={pitcher.PlayerID}>{pitcher.Name}</td>
                   <td className="td-total-score"
                       style={{backgroundColor: pitcher.TotalScoreColor,
                       textAlign: "center"}}>{pitcher.TotalScore}</td>
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
