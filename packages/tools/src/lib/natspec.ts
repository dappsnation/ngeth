import { DeveloperDocumentation, DevMethodDoc } from "@type/solc";

export interface Natspec {
  [nodeName: string]: {
    [tagName: string]: string;
  }
}

// export function getNatspec(ast: any) {
//   const contracts = ast.nodes.filter((node: any) => node.nodeType === 'ContractDefinition');
//   const docs: Record<string, Natspec> = {};
//   for (const contract of contracts) {
//     docs[contract.name] = {};
//     if (contract.documentation) {
//       docs[contract.name]['class'] = parseDoc(contract.documentation.text.trim())
//     }
//     for (const node of contract.nodes) {
//       if (!node.documentation) continue;
//       docs[contract.name][node.name] = parseDoc(node.documentation.text.trim());
//     }
//   }
//   return docs;
// }


// function parseDoc(doc: string) {
//   const tags: Record<string, string> = {};
//   const fields = doc.split('@').filter(v => !!v);
//   for (const field of fields) {
//     const [first, ...rest] = field.split(' ');
//     const tag = first.startsWith('custom:') ? first.replace('custom:', '') : first;
//     tags[tag] = rest.join(' ');
//   }
//   return tags;
// }

// export function toJsDoc(nodeDoc?: Record<string, string>) {
//   if (!nodeDoc) return '';
//   const fields = Object.entries(nodeDoc).map(jsDocTag).filter(v => !!v).join('');
//   if (!fields.length) return '';
//   return `/**${fields}\n\t */`;
// }

export function toMethodJsDoc(method?: DevMethodDoc) {
  if (!method) return '';
  const title = method.details ? `\n\t * ${method.details}` : '';
  const params = Object.entries(method.params || {}).map(([key, content]) => `\n\t * @param ${key} ${content}`);
  const returns = method.return ? `\n\t * @returns ${method.details}` : '';
  const lines = [title, ...params, returns].filter(v => !!v).join('');
  return `/**${lines}\n\t */`;
}

export function toContractJsDoc(devdoc?: DeveloperDocumentation) {
  if (!devdoc) return '';
  const title = devdoc.title ? `\n\t * ${devdoc.title}` : '';
  const details = devdoc.details ? `\n\t * ${devdoc.details}` : '';
  const lines = [title, details].filter(v => !!v).join('');
  return `/**${lines}\n\t */`;
}

// function jsDocTag([tag, content]: [string, string]) {
//   if (tag === 'notice') return; // this is intented for the end user not the developer

//   const text = content.split('\n').map(t => t.trim()).filter(v => !!v).join('\n\t * ');
//   if (tag === 'dev' || tag === 'title') return `\n\t * ${text}`;
//   if (tag === 'return') return `\n\t * @returns ${text}`;

  
//   // In the example below, the tag ends with \n
//   /// @custom:example
//   /// ```
//   /// someCode()
//   /// ```
//   return `\n\t * @${tag.replace('\n', '\n\t *')} ${text}`;
// }