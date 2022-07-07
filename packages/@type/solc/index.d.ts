export * from './output'
export * from './input'
export * from './abi'
export * from './solidity-ast'
export * from './yul-ast'

export interface ImportCallback {
  import: (path: string) => { contents: string } | { error: string }
  smtSolver: (query: string) => { contents: string } | { error: string }
}

interface Solc {
  features: {
    legacySingleInput: boolean
    multipleInputs: boolean
    importCallback: boolean
    nativeStandardJSON: boolean
  },
  lowlevel: {
    compileSingle(input: string): string
    compileMulti(input: string): string
    compileCallback(input: string): string
    compileStandard(input: string): string
  },
  version(): string
  semver(): string
  license(): string
  loadRemoteVersion(version: string, callback: (err: string, snapshot: Solc) => unknown): void
  compile(input: string, readCallback?: ImportCallback): string
}

export default Solc
