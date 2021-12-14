import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static defaultProps = {
    displayTitle: false,
    displayLegend: true,
    legendPosition: 'right',
    location: 'City'
  }

  render() {
    return (
      <div>
        <Pie
          data={this.props.data}
          options={{
            title: {
              display: this.props.displayTitle,
              text: this.props.title,
              fontSize: 20
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition
            }
          }}
        />
      </div>
    )
  }
}

export default PieChart
