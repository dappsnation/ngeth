import { DeveloperDocumentation, DevMethodDoc } from "@type/solc";

// TODO: Find a way to inherit events
// See: https://github.com/ethereum/solidity/issues/8911#issuecomment-654773718

export function toJsDoc(text?: string) {
  if (!text) return '';
  return `/** ${text} */`;
}

export function toMethodJsDoc(method?: DevMethodDoc) {
  if (!method) return '';
  const title = method.details ? `\n\t * ${method.details}` : '';
  const params = Object.entries(method.params || {}).map(([key, content]) => `\n\t * @param ${key} ${content}`);
  const returns = method.return ? `\n\t * @returns ${method.details}` : '';
  const lines = [title, ...params, returns].filter(v => !!v).join('');
  return `/**${lines}\n\t */`;
}

export function toContractJsDoc(devdoc?: DeveloperDocumentation) {
  if (!devdoc || (!devdoc.title && !devdoc.details)) return '';
  const title = devdoc.title ? `\n\t * ${devdoc.title}` : '';
  const details = devdoc.details ? `\n\t * ${devdoc.details}` : '';
  const lines = [title, details].filter(v => !!v).join('');
  return `/**${lines}\n\t */`;
}
