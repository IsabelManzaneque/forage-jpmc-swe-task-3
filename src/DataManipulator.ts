import { ServerRespond } from './DataStreamer';

export interface Row {
  abdPrice: number,
  defPrice: number,
  ratio: number,
  upperBound: number,
  lowerBound: number,
  triggerAlert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) : Row {    
    let abdPrice= (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    let defPrice= (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    let ratio = abdPrice/defPrice;
    return {
      abdPrice: abdPrice,
      defPrice: defPrice,
      ratio: ratio,
      upperBound: 1.05,
      lowerBound: 0.95,
      triggerAlert: (ratio > 1.05 || ratio < 0.95) ? ratio : undefined,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,      
    };
    
  }
}
