import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Link } from 'react-router-dom'

import Action from '../actions/Actions';
import generalConst from '../constants/general-constants';

const DropDown = (props) => {
  return(
    <div>
      <DropDownMenu
        value={props.filter_type}
        onChange={props.handleFilterChange}
        labelStyle={{color: 'white'}}
        underlineStyle={{display: 'none'}}
      >
        <MenuItem value={generalConst.FILTER_NONE} primaryText="FILTER: None" />
        <MenuItem value={generalConst.FILTER_MEAN} primaryText="FILTER: MEAN" />
      </DropDownMenu>

      <DropDownMenu
        value={props.data_type}
        onChange={props.handleDataChange}
        labelStyle={{color: 'white'}}
        underlineStyle={{display: 'none'}}
      >
        <MenuItem value={generalConst.DATA_WILD_TYPE} primaryText="wild-type" />
        <MenuItem value={generalConst.DATA_TRP_TYPE} primaryText="trp-3 mutant" />
      </DropDownMenu>
    </div>
  );
};

export default class CausalVisAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      data_type: props.data_type,
      filter_type: props.filter_type
    };

    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleDefaultClick = this.handleDefaultClick.bind(this);
    this.handleCrossCorrelation = this.handleCrossCorrelation.bind(this);
    this.handleThreeDim = this.handleThreeDim.bind(this);
    this.handleGraph = this.handleGraph.bind(this);
  }

  handleIconClick() {
    this.setState({
        open: !this.state.open
    });
  }

  handleDataChange(event, index, data_type) {
    this.setState({
      data_type: data_type
    });
    Action.handleDataChange(data_type);
  }

  handleFilterChange(event, index, filter_type) {
    this.setState({
      filter_type: filter_type
    });
    Action.handleFilterChange(filter_type);
  }


  handleDefaultClick() {
    this.setState({
      open: !this.state.open
    });
    Action.handleDefaultClick();
  }

  handleCrossCorrelation() {
    this.setState({
      open: !this.state.open
    });
    Action.handleCrossCorrelation();
  }

  handleThreeDim() {
    this.setState({
      open: !this.state.open
    });
    Action.handleThreeDim();
  }

  handleGraph() {
    this.setState({
      open: !this.state.open
    });
    Action.handleGraph();
  }

  renderAppBar() {
    if (this.state.open === true) {
      return(
        <div>
          <AppBar
            style={{height: 64}}
            iconElementRight={
              <DropDown
                data_type={this.state.data_type}
                filter_type={this.state.filter_type}
                handleDataChange={this.handleDataChange}
                handleFilterChange={this.handleFilterChange}
              />
            }
          />
          <Drawer
            width={250}
          >
            <AppBar
              title="CausalVis"
              onLeftIconButtonTouchTap={this.handleIconClick}
            />
            <Link to='/' onClick={this.handleDefaultClick}>
              <MenuItem>default view</MenuItem>
            </Link>
            <Link to='/cross' onClick={this.handleCrossCorrelation}>
              <MenuItem>Cross Correlation</MenuItem>
            </Link>
            <Link to='/threedim' onClick={this.handleThreeDim}>
              <MenuItem>3D View</MenuItem>
            </Link>
            <Link to='/graph' onClick={this.handleGraph}>
              <MenuItem>Graph View</MenuItem>
            </Link>
          </Drawer>
        </div>
      );
    } else {
      return (
        <AppBar
          title="CausalVis"
          style={{height: 64}}
          onLeftIconButtonTouchTap={this.handleIconClick}
          iconElementRight={
            <DropDown
              data_type={this.state.data_type}
              filter_type={this.state.filter_type}
              onChange={this.handleDropChange}
              handleDataChange={this.handleDataChange}
              handleFilterChange={this.handleFilterChange}
            />
          }
        />
      );
    }
  }

  render() {
    return (
      <div>
        {(() => {
          return this.renderAppBar();
        })()}
      </div>
    );
  }
}
