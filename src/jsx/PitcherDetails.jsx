import React from 'react';


const PitcherDetails = React.createClass({

    getInitialState: function() {
        return {
        }
    },

    render: function() {
        let cp = this.props.chosenProjections,
            cd = this.props.chosenDetails;

        return (
            <div>
                <table key="cp.PlayerID">
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <th className="th-title">Projections7</th>
                            <td>
                                <img src = {cd.PhotoUrl}
                                     alt = {cp.Name}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Name
                            </th>
                            <td className="td-value">
                                {cp.Name}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Team
                            </th>
                            <td className="td-value">
                                {cp.Team}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Opponent
                            </th>
                            <td className="td-value">
                                {cp.Opponent}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Pitching
                            </th>
                            <td className="td-value">
                                {cp.HomeOrAway}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Throws
                            </th>
                            <td className="td-value">
                                {cd.ThrowHand}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                MLB Salary
                            </th>
                            <td className="td-value money">
                                {cd.Salary}
                            </td>
                        </tr>

                        <tr>
                            <th className="th-label">
                                DraftKings Salary
                            </th>
                            <td className="td-value money">
                                {cp.DraftKingsSalary}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                FanDuel Salary
                            </th>
                            <td className="td-value money">
                                {cp.FanDuelSalary}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Yahoo Salary
                            </th>
                            <td className="td-value money">
                                {cp.YahooSalary}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Projected Earned Runs
                            </th>
                            <td className="td-value">
                                {cp.PitchingEarnedRuns}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Projected Strikeouts
                            </th>
                            <td className="td-value">
                                {cp.PitchingStrikeouts}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Projected Walks
                            </th>
                            <td className="td-value">
                                {cp.PitchingWalks}
                            </td>
                        </tr>
                        <tr>
                            <th className="th-label">
                                Projected Hits Allowed
                            </th>
                            <td className="td-value">
                                {cp.PitchingHits}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
});

module.exports = PitcherDetails;
