import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import generalConst from '../../constants/general-constants'
import Action from '../../actions/Actions'

export default class SelectOptView extends React.Component {
  constructor(props) {
    super(props);

    this.handleOptChange = this.handleOptChange.bind(this);
    this.setParams = this.setParams.bind(this);
  }

  handleRunOpt() {
    Action.handleRunOpt();
  }

  handleOptChange(event, index, opt_type) {
    Action.handleOptChange(opt_type);
  }

  setParams(obj) {
    Action.handleParamsChange(obj.target.name, obj.target.value);
  }

  getWindowPixelsContents() {
    let contents = [];
    for (let i = 1; i <= 19; i += 2) {
      contents.push(<option value={i} key={i}>{i}</option>);
    }
    return contents;
  }

  getWindowFramesContents() {
    let contents = [];
    for (let i = 10; i <= 50; i += 10) {
      contents.push(<option value={i} key={i}>{i}</option>);
    }
    return contents;
  }

  getMaxLagContents() {
    let contents = [];
    for (let i = 6; i <= 20; i += 2) {
      contents.push(<option value={i} key={i}>{i}</option>);
    }
    return contents;
  }

  render() {
    return (
      <div>
        <RaisedButton label="Run Causal Analysis" onClick={this.handleRunOpt} style={{position: 'relative', margin: 0, top: 40}} />

        <div className="arrow1" style={{position: 'relative', top: 50, textTransform: 'none'}}></div>

        <div style={{position: 'relative', top: 60, height: 60}}>
          <div> Algorithm: </div>
          <DropDownMenu
            value={this.props.parent_state.opt_type}
            onChange={this.handleOptChange}
            style={{left: 20, top: -10, fontSize: 13}}
            labelStyle={{color: 'black'}}
          >
            <MenuItem value={generalConst.OPT_LUCAS} primaryText="Lucas & Kanade" />
            <MenuItem value={generalConst.OPT_SPATIO} primaryText="SpatioTemporal" />
            <MenuItem value={generalConst.CAUSAL_CROSS_CORRELATION} primaryText="Cross Correlation" />
            <MenuItem value={generalConst.CAUSAL_GRANGER} primaryText="Granger Causality" />
            <MenuItem value={3} disabled={true} primaryText="Causal Flow" />
          </DropDownMenu>
        </div>
        <div style={{position: 'relative', top: 80}}>
          <p style={{textAlign: "right"}}>
            {"window pixels "}
            <select name={"win_pixels"} value={this.props.parent_state.cross_win_pixels} onChange={this.setParams}>
              { this.getWindowPixelsContents() }
            </select>
          </p>

          <p style={{textAlign: "right"}}>
            {"window frames "}
            <select name={"win_frames"} value={this.props.parent_state.cross_win_frames} onChange={this.setParams}>
              { this.getWindowFramesContents() }
            </select>
          </p>

          <p style={{textAlign: "right"}}>
            {"max lag "}
            <select name={"max_lag"} value={this.props.parent_state.cross_max_lag} onChange={this.setParams}>
              { this.getMaxLagContents() }
            </select>
          </p>
        </div>
      </div>
    );
  }
}
