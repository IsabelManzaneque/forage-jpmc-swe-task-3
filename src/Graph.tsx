import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

// We want to display the ratio, which is price_a/price_b (where price = (bidPrice+askPrice)/2)
// First, in schema, we need to add the fiels we are going to need: The price of abc and def to calculate
// the ratio, the bounds and the trigger alert. We are going to delete the fields we dont need anymore: stock and 
// top bid/ask price.
// En linea 50, add as column attributes

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      // delete stock, top ask and bid price. Add price of abc, def, ratio, bounds, alert
      abdPrice: 'float',
      defPrice: 'float',
      ratio: 'float',
      upperBound: 'float',
      lowerBound: 'float',
      triggerAlert: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');  
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lowerBound", "upperBound", "triggerAlert"]');
      elem.setAttribute('aggregates', JSON.stringify({        
        abcPrice: 'avg',
        defPrice: 'avg',
        ratio: 'avg',
        upperBound: 'avg',
        lowerBound: 'avg',
        triggerAlert: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
