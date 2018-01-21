import React from 'react';

export default class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {size: {width: 600, height: 600}};
  }
  changeSize(size) {
    this.setState({size});
  }
  render() {
    const {width, height} = this.state.size;
    return (
      <div
        className="display"
        style={{width: `${width}px`, height: `${height}px`}}
      >
        {this.props.children}
      </div>
    );
  }
}
