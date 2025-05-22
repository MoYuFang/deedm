export class GraphConfigure{
  constructor(width, height){
    for(let [key,value] of Object.entries({
      width: width,
      height: height,
      node_radius:13,
      arrow_len:13,
    }))this[key]=value;
  }
}