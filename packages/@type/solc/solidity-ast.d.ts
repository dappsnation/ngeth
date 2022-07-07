type Location = `${number}:${number}:${number}`;
type StateMutability = 'payable' | 'nonpayable' | 'view' | 'pure';
type Visibility = 'internal' | 'external' | 'public' | 'private';
type Operator = '==' | '!=' | '>' | '>=' | '<' | '<=' | '||' | '&&' | '+' | '+=' | '++' | '-' | '-=' | '--';
type AssignmentOperator = '=' | '+=' | '-=';

interface TypeDescription {
  typeIdentifier: string;
  typeString: string;
}

export interface SolidityNode {
  id: number;
  src: Location;
  nodeType: string;
}

export interface SourceUnit extends SolidityNode {
  nodeType: 'SourceUnit';
  license: string;
  absolutePath: string;
  exportedSymbols: Record<string, number[]>;
  nodes: SolidityNode[];

}

export interface PragmaDirective extends SolidityNode {
  nodeType: 'PragmaDirective';
  literals: string[];
}

export interface ImportDirective extends SolidityNode {
  nodeType: 'ImportDirective';
  absolutePath: string;
  file: string;
  nameLocation: string;
  scope: number;
  sourceUnit: number;
  symbolAliases: string[];
  unitAlias: string;
}


export interface ContractDefinition extends SolidityNode {
  nodeType:'ContractDefinition';
  abstract: boolean;
  baseContracts: SolidityNode[];
  canonicalName: string;
  contractDependencies: string[];
  contractKind: 'contract' | 'interface' | 'library';
  documentation: StructuredDocumentation;
  fullyImplemented: boolean;
  linearizedBaseContracts: number[];
  name: string;
  nameLocation: Location;
  nodes: SolidityNode[];
  scope: number;
  usedErrors: any[];
}

export interface StructuredDocumentation extends SolidityNode {
  nodeType: 'StructuredDocumentation';
  text: string;
}

export interface InheritanceSpecifier extends SolidityNode {
  nodeType: 'InheritanceSpecifier';
  baseName: SolidityNode;
}

export interface IdentifierPath extends SolidityNode {
  nodeType: 'IdentifierPath';
  name: string;
  referencedDeclaration: number;
}

export interface VariableDeclaration extends SolidityNode {
  nodeType: 'VariableDeclaration';
  mutability: 'mutable' | 'immutable';
  name: string;
  nameLocation: Location;
  scope: number;
  stateVariable: boolean;
  storageLocation: string; // 'default'
  typeDescriptions: TypeDescription
  typeName: ElementaryTypeName;
  visibility: Visibility;
  virtual: boolean;
}

export interface ElementaryTypeName extends SolidityNode {
  nodeType: 'ElementaryTypeName';
  name: string;
  stateMutability: StateMutability;
  typeDescriptions: TypeDescription
}

export interface ElementaryTypeNameExpression extends SolidityNode {
  nodeType: 'ElementaryTypeNameExpression';
  argumentTypes: TypeDescription[];
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
  typeDescriptions: TypeDescription;
  typeName: ElementaryTypeName;
}

export interface FunctionDefinition {
  nodeType: 'FunctionDefinition';
  body: Block;
  parameters: ParameterList;
  returnParameters: ParameterList;
  name: string;
  nameLocation: Location;
  modifiers: ModifierInvocation[];
  kind: 'function';
  implemented: boolean;
  scope: number;
  virtual: boolean;
  visibility: Visibility;
  functionSelector?: string;
  documentation?: StructuredDocumentation
}

export interface ParameterList {
  nodeType: 'ParameterList';
  parameters: SolidityNode[];
}

export interface ModifierInvocation {
  nodeType: 'ModifierInvocation';
  modifierName: SolidityNode;
  kind: 'modifierInvocation'
}

export interface Block extends SolidityNode {
  nodeType: 'Block';
  statements: ExpressionStatement[];
}

export interface IdentifierPath extends SolidityNode {
  nodeType: 'IdentifierPath';
  name: string;
  referencedDeclaration: number;
}

export interface ExpressionStatement extends SolidityNode {
  nodeType: 'ExpressionStatement';
  expression: SolidityNode;
}

export interface FunctionCall extends SolidityNode {
  nodeType: 'FunctionCall' | 'typeConversion';
  kind: 'functionCall';
  expression: SolidityNode;
  arguments: SolidityNode[];
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
  tryCall: boolean;
  typeDescriptions: TypeDescription;
  names: string[];
}

export interface Identifier extends SolidityNode {
  nodeType: 'Identifier';
  argumentTypes: TypeDescription[];
  name: string;
  overloadedDeclarations: number[];
  referencedDeclaration: number;
  typeDescriptions: TypeDescription
}


export interface Return extends SolidityNode {
  nodeType: 'Return';
  expression: SolidityNode;
  functionReturnParameters: number;
}

export interface Literal extends SolidityNode {
  hexValue: string;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
  kind: string;
  typeDescriptions: TypeDescription;
  value: any;
}


export interface PlaceholderStatement extends SolidityNode {
  nodeType: 'PlaceholderStatement';
}

export interface BinaryOperation extends SolidityNode {
  nodeType: 'BinaryOperation';
  operator: Operator;
  commonType: TypeDescription;
  rightExpression: SolidityNode;
  leftExpression: SolidityNode;
  typeDescriptions: TypeDescription;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
}

export interface UnaryOperation extends SolidityNode {
  nodeType: 'UnaryOperation';
  typeDescriptions: TypeDescription;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
  subExpression: SolidityNode;
  operator: Operator;
  prefix: boolean;
}

export interface Assignment extends SolidityNode {
  nodeType: 'Assignment';
  operator: '=';
  rightHandSide: SolidityNode;
  leftHandSide: SolidityNode;
  typeDescriptions: TypeDescription;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
}

export interface EventDefinition extends SolidityNode {
  nodeType: 'EventDefinition';
  anonymous: boolean;
  documentation?: StructuredDocumentation;
  name: string;
  nameLocation: Location;
  parameters: ParameterList;
}

export interface EmitStatement extends SolidityNode {
  nodeType: 'EmitStatement';
  eventCall: FunctionCall;
}

export interface ArrayTypeName extends SolidityNode {
  nodeType: 'ArrayTypeName';
  typeDescriptions: TypeDescription;
  length: SolidityNode;
  baseType: ElementaryTypeName;
}

export interface ForStatement extends SolidityNode {
  nodeType: 'ForStatement';
  body: Block;
  loopExpression: SolidityNode;
  initializationExpression: SolidityNode;
  condition: SolidityNode;
}

export interface IfStatement extends SolidityNode {
  nodeType: 'IfStatement';
  trueBody: Block;
  condition: SolidityNode;
}

export interface MemberAccess extends SolidityNode {
  nodeType: 'MemberAccess';
  memberName: string;
  typeDescriptions: TypeDescription;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
}

export interface IndexAccess extends SolidityNode {
  nodeType: 'IndexAccess';
  indexExpression: SolidityNode;
  baseExpression: SolidityNode;
  typeDescriptions: TypeDescription;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  lValueRequested: boolean;
}

// -------------------


export interface AstNodeLegacy {
  id: number
  name: string
  src: string
  children?: AstNodeLegacy[]
  attributes?: AstNodeAtt
}

export interface AstNodeAtt {
  operator?: string
  string?: null
  type?: string
  value?: string
  constant?: boolean
  name?: string
  public?: boolean
  exportedSymbols?: Record<string, unknown>
  argumentTypes?: null
  absolutePath?: string
  [x: string]: any
}