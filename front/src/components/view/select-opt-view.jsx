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
  }

  handleRunOpt() {
    Action.handleRunOpt();
  }

  handleOptChange(event, index, opt_type) {
    Action.handleOptChange(opt_type);
  }

  render() {
    return (
      <div>
        <RaisedButton label="Run Causal Analysis" onClick={this.handleRunOpt} style={{position: 'relative', margin: 0, top: 40}} />

        <div className="arrow1" style={{position: 'relative', top: 50, textTransform: 'none'}}></div>

        <div style={{position: 'relative', top: 60}}>
          <div> Algorithm: </div>
          <DropDownMenu
            value={this.props.opt_type}
            onChange={this.handleOptChange}
            style={{left: 20, top: -10, fontSize: 13}}
            labelStyle={{color: 'black'}}
          >
            <MenuItem value={generalConst.OPT_LUCAS} primaryText="Lucas & Kanade" />
            <MenuItem value={generalConst.OPT_SPATIO} primaryText="SpatioTemporal" />
            <MenuItem value={generalConst.CAUSAL_CROSS_CORRELATION} primaryText="Cross Correlation" />
            <MenuItem value={3} disabled={true} primaryText="Causal Flow" />
          </DropDownMenu>
        </div>
      </div>
    );
  }
}
