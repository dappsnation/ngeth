import * as parserTypeScript from "prettier/parser-typescript";
import * as prettier from "prettier/standalone";
export function formatTs(code: string) {
  return prettier.format(code, {
    parser: 'typescript',
    plugins: [parserTypeScript],
    printWidth: 120,
  });
}