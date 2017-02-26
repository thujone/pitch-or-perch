import React from 'react';
import PitcherDetails from './PitcherDetails.jsx';
import { Accordion, AccordionItem } from 'react-sanfona';

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

            var title =
                <div className={"accordion-list-item-shell"}>{pitcher.Name}
                    <span className={"accordion-item-score"} style={{backgroundColor: pitcher.TotalScoreColor}}>
                        {pitcher.TotalScore}
                    </span>
                </div>;

            return (
                <AccordionItem
                    title={title}
                    slug={pitcher.PlayerID}
                    key={pitcher.PlayerID}
                    className={"accordion-list-item"}
                >
                    <PitcherDetails
                        chosenProjections = {this.props.pitcherProjections['pitcher' + pitcher.PlayerID]}
                        chosenDetails = {this.props.pitcherDetails['pitcher' + pitcher.PlayerID]}
                    />
                </AccordionItem>

            );
        });

        return (
            <div id="pitcher-list">
                <Accordion
                    className={"accordion-list"}
                    allowMultiple={false}
                >
                    {pitcherNodes}
                </Accordion>
            </div>


        );
    }
});

module.exports = PitcherList;
