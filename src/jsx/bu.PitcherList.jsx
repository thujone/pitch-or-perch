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
        let i = 0;
        let pitcherNodes = this.props.pitcherNodes.map((pitcher) => {
            i++;
            return (
                <li key={pitcher.PlayerID}>
                    <div className="player-bar">
                        <a href={'#accordion' + i} aria-expanded="false" aria-controls={'accordion' + i}
                           className="accordion-title accordionTitle js-accordionTrigger" onclick={this.doThis} >
                            {pitcher.Name}
                        </a>
                        <span>
                            {pitcher.TotalScore}
                        </span>
                    </div>
                    <div className="accordion-content accordionItem is-collapsed" id={'#accordion' + i}>
                        Wow, this is something.
                    </div>
                </li>
            );
        });

        return (
            <div id="pitcher-list">
                <div className="container">
                    <div className="accordion">
                        <ul>
                            {pitcherNodes}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = PitcherList;
