import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import Actions from '../../actions/Actions'

import ResultContainer from '../container/result-container.jsx'

export default class ComparisonView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown_value: 0
    };

    this.handleDropChange = this.handleDropChange.bind(this);
    this.handleCalcClick = this.handleCalcClick.bind(this);
  }

  handleDropChange(event, index, value) {
    this.setState({
      dropdown_value: value
    });
  }

  handleCalcClick() {
    console.log('a');
  }

  render() {
    return (
      <div>
        <div style={{fontSize: 16}}>Comparison view</div>
        <br />

        <div style={{marginLeft: 50, marginRight: 200,display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 16}}>Upper</div>
            <ResultContainer
              id="tiff_output_3"
              canvas_width={this.props.parent_state.canvas_width}
              canvas_height={this.props.parent_state.canvas_height}
              clicked_point={this.props.parent_state.clicked_point}
              loupe_point={this.props.parent_state.loupe_point}
              selected_area={this.props.parent_state.selected_area}
              tiff_index={this.props.parent_state.tiff_index}
              tiff_list={this.props.tiff_list}
              opt_type={this.props.parent_state.save_vector_fields.upper.opt_type}
              vector_fields={this.props.parent_state.save_vector_fields.upper.data}
            />
            <br />

            <div style={{fontSize: 16}}>Lower</div>
            <ResultContainer
              id="tiff_output_4"
              canvas_width={this.props.parent_state.canvas_width}
              canvas_height={this.props.parent_state.canvas_height}
              clicked_point={this.props.parent_state.clicked_point}
              loupe_point={this.props.parent_state.loupe_point}
              selected_area={this.props.parent_state.selected_area}
              tiff_index={this.props.parent_state.tiff_index}
              tiff_list={this.props.tiff_list}
              opt_type={this.props.parent_state.save_vector_fields.lower.opt_type}
              vector_fields={this.props.parent_state.save_vector_fields.lower.data}
            />
          </div>

          <div>
            <div>
              <DropDownMenu
                value={this.state.dropdown_value}
                onChange={this.handleDropChange}
                // style={{left: 20, top: -10, fontSize: 13}}
                // labelStyle={{color: 'black'}}
              >
                <MenuItem value={0} primaryText="Upper &cap; Lower" />
                <MenuItem value={1} primaryText="Upper &cup; Lower" />
              </DropDownMenu>
              <RaisedButton label="Calculate" onClick={this.handleCalcClick}/>
            </div>
          </div>

          <div>
            c
          </div>
        </div>
      </div>
    );
  }
}
