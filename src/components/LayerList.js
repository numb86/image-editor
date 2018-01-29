import React from 'react';

import ViewLayer from './ViewLayer';

export default class LayerList extends React.Component {
  constructor(props) {
    super(props);
    this.ids = [];
  }
  componentDidMount() {
    console.log(this.ids);
  }
  render() {
    return this.props.viewLayerDataList.map(data => {
      const {id} = data;
      delete data.id;
      return (
        <ViewLayer
          ref={ref => this.ids.push({id, ViewLayer: ref})}
          key={id}
          {...data}
        />
      );
    });
  }
}
