import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import generalConst from '../../constants/general-constants'

export default class SelectOptView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="arrow1" style={{position: 'relative', top: 100}}></div>

        <div style={{position: 'relative', top: 120}}>
          <div> Algorithm: </div>
          <DropDownMenu
            value={generalConst.FILTER_NONE}
            // onChange={props.handleFilterChange}
            style={{left: 20, top: -10, fontSize: 13}}
            labelStyle={{color: 'black'}}
          >
            <MenuItem value={generalConst.FILTER_NONE} primaryText="Lucas & Kanade" />
            <MenuItem value={generalConst.FILTER_MEAN} primaryText="SpatioTemporal" />
            <MenuItem value={3} primaryText="Causal Flow" />
          </DropDownMenu>
        </div>
      </div>
    );
  }
}
