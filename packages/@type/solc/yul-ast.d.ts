type YulNodeType = `Yul${string}`;

export interface YulNode {
  nodeType: YulNodeType;
  src: `${number}:${number}:${number}`;
}

export interface YulBlock extends YulNode {
  nodeType: 'YulBlock';
  statement: YulNode[];
}

export interface YulAssignment extends YulNode {
  nodeType: 'YulAssignment';
  value: YulNode;
  variableNames: YulIdentifier;
}

export interface YulFunctionDefinition extends YulNode {
  nodeType: 'YulFunctionDefinition';
  body: YulNode;
  name: string;
  parameters?: YulNode[]
  returnVariables?: YulNode[]
}


export interface YulTypedName extends YulNode {
  nodeType: 'YulTypedName';
  type: string;
  name: string;
}

export interface YulIdentifier extends YulNode {
  name: string;
  nodeType: 'YulIdentifier';
}

export interface YulFunctionCall {
  nodeType: 'YulFunctionCall';
  arguments: YulNode[];
  functionName: YulIdentifier
}

export interface YulExpressionStatement extends YulNode {
  nodeType: 'YulExpressionStatement';
  expression: YulNode;
}

export interface YulLiteral extends YulNode {
  nodeType: 'YulLiteral';
  kind: string;
  type: string;
  value: string;
}

export interface YulIf extends YulNode {
  nodeType: 'YulIf';
  body: YulNode;
  condition: YulNode;
}

export interface YulForLoop extends YulNode {
  nodeType: 'YulForLoop';
  body: YulBlock;
  pre: YulBlock;
  post: YulBlock;
  condition: YulNode;
}

export interface YulVariableDeclaration extends YulNode {
  nodeType: 'YulVariableDeclaration';
  value: YulNode;
  variables: YulNode[]
}