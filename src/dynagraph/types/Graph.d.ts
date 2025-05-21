class Graph {
  constructor(
    width: number,                      //画布宽度
    height: number                      //画布高度
  );

  //会根据字符串对节点、边进行增删，新增节点坐标随机。字符串格式见使用案例。
  str_to_graph(str: string): void;

  add_node(
    name: string,                       //节点已存在时会失败
    pos: undefined | [number, number]   //不指定坐标时坐标随机
  ): Boolean;

  //删除节点时首先会删除与它相连的所有边
  del_node(name: string): Boolean;

  //两种添加方式 add_edge('1', '2') 与 add_edge('1 2')
  //加边前先确保两端点存在，否则失败
  //方式二直接指定了边的名字，格式是 'nameA nameB'，其中字典序须 (nameA < nameB)
  //若 nameA 或 nameB 对应的节点不存在则加边失败并报错
  add_edge(name1: string, name2: string | undefined): Boolean;

  //使用方式同 add_edge 类似
  del_edge(name1: string, name2: string | undefined): Boolean;

  //显示有向边的方向，默认不显示，边名 'nameA nameB' 须 nameA < nameB 
  arrow(
    ename: string,                       //边名
    pos: boolean,                        //正方向 nameA -> nameB
    neg: boolean,                        //反方向 nameB -> nameA
  ): void;
}
