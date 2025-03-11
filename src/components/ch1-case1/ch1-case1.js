'use-strict'

//Build syntax tree from text
//Some test cases are in the bottom

const DEBUG = false;

function log(...msg){
    if (DEBUG){
        console.log(...msg);
    }
}

export class SyntaxTreeNode {
    constructor(value, left_child = null, right_child = null) {
        this.value = value;//Operator | Variable
        this.left_child = left_child;//SyntaxTreeNode
        this.right_child = right_child;//SyntaxTreeNode
    }
}

export class Operator{
    constructor(name, level = 1, op_type = -1) {
        this.name = name;
        this.is_operator = true;
        this.level = level;
        this.op_type = op_type
    }
}

export class Variable {
    constructor(name) {
        this.name = name;
        this.is_operator = false;
    }
}

const operator_set = {
    'neg': new Operator('neg', 5, 0),
    'and': new Operator('and', 4, -1),
    'or': new Operator('or', 3, -1),
    'imply': new Operator('imply', 2, 1),
    'bi_imply': new Operator('bi_imply', 1, -1),
    '(': new Operator('(', 0, -2),
    ')': new Operator(')', 0, 2),
}

export const op_map = {
    '\\neg': operator_set['neg'],
    '-': operator_set['neg'],
    '\\wedge': operator_set['and'],
    '\\land': operator_set['and'],
    '\\vee': operator_set['or'],
    '\\lor': operator_set['or'],
    '\\rightarrow': operator_set['imply'],
    '\\implies': operator_set['imply'],
    '\\to': operator_set['imply'],
    '\\leftrightarrow': operator_set['bi_imply'],
    '\\iff': operator_set['bi_imply'],
};

export const var_map = {
    
};

// p\vee(q\wedge r)\leftrightarrow(p\vee q)\wedge(p\vee r)


export function build_syntax_tree_from_str(str) {
    let re = /[\d\w\_]+|\\[\d\w\_]+|\(|\)|\-/g;
    let result = str.match(re);
    console.log(result);

    let stk_tree = [], stk_op = [];
    function push_stk_tree(x) {
        // console.log("push("+x.name+")");
        if (x.is_operator) {
            if (x.op_type === 0) {
                if (stk_tree.length === 0) {
                    throw new SyntaxError('Syntax error!');
                }
                let y = stk_tree.pop();
                stk_tree.push(new SyntaxTreeNode(x, y, null));
            }
            else {
                if (stk_tree.length < 2) {
                    throw new SyntaxError('Syntax error!');
                }
                let z = stk_tree.pop(), y = stk_tree.pop();
                stk_tree.push(new SyntaxTreeNode(x, y, z));
            }
        }
        else{
            stk_tree.push(new SyntaxTreeNode(x, null, null));
        }
    }

    try {
        for (let x of result) {
            if (x === '(') {
                // console.log(`x:${x} (`);
                stk_op.push(operator_set['(']);
            }
            else if (x === ')') {
                // console.log(`x:${x} )`);
                while (stk_op.length > 0 && stk_op[stk_op.length - 1].op_type !== -2) {
                    push_stk_tree(stk_op.pop())
                }
                if (stk_op.length <= 0 || stk_op[stk_op.length - 1].op_type !== -2) {
                    throw new SyntaxError('Syntax error!');
                }
                else {
                    stk_op.pop();
                }
            }
            else if (op_map[x]) {
                // console.log(`x:${x} op`);
                let op_x = op_map[x];
                while (
                    stk_op.length > 0 && 
                    stk_op[stk_op.length - 1].op_type !== -2 &&
                    (stk_op[stk_op.length - 1].level > op_x.level ||
                        stk_op[stk_op.length - 1].level === op_x.level && op_x.op_type !== 1
                    )) {
                    push_stk_tree(stk_op.pop());
                }
                stk_op.push(op_x);
            }
            else {
                // console.log(`x:${x} var`);
                if (var_map[x]===undefined)var_map[x]=new Variable(x);
                push_stk_tree(var_map[x]);
            }
        }
        while(stk_op.length > 0){
            let x = stk_op.pop();
            if (x.op_type === -2){
                throw new SyntaxError('Syntax error!');
            }
            push_stk_tree(x);
        }
        if (stk_tree.length !== 1){
            throw new SyntaxError('Syntax error!');
        }
    } catch (error) {
        throw error;
    }
    return stk_tree[0];
}

//test for debugging
if (DEBUG){
    var test_str = [
        "p\\vee(q\\wedge r)\\leftrightarrow(p\\vee q)\\wedge(-p\\rightarrow r)",
        'a\\rightarrow b\\rightarrow c\\rightarrow d\\rightarrow e',
        'a\\to b\\to c\\iff d\\to e\\to f\\iff a\\land\\mu'
    ]

    let rt = build_syntax_tree_from_str(test_str[test_str.length-1]);
    function show(x, depth=0){
        if (!(x instanceof SyntaxTreeNode)) throw new Error("Unexpected input.");
        let s='';
        for(let i=0;i<depth;++i) s+='    ';
        s+=x.value.name;
        log(s);
        if (x.left_child !== null) show(x.left_child, depth+1);
        if (x.right_child !== null) show(x.right_child, depth+1);
    }
    show(rt);
}