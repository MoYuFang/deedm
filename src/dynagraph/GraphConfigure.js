export class GraphConfigure{
  constructor(){
    for(let [key,value] of Object.entries({
      node_radius:13,
      arrow_len:13,
    }))this[key]=value;
  }
}