import { resolve, join, parse as parsePath } from "path";
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettier from "prettier/standalone";
import { promises as fs } from 'fs';
import { createServer } from 'http';
import { URL } from 'url';

export function formatTs(code: string) {
  return prettier.format(code, {
    parser: 'typescript',
    plugins: [parserTypeScript],
    printWidth: 120,
  });
}

export function getContractNames(allNames: string[], src: string) {
  return allNames.filter((name) => resolve(name).startsWith(src));
}

export function getContractImportNames(allNames: string[], src: string) {  
  return allNames.filter((name) => !resolve(name).startsWith(src));
}


export function serveApp(directory: string, port: number) {
  const mimeTypes = {
    ".html": "text/html",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".js": "text/javascript",
    ".css": "text/css"
  };

  function isMimeType(extension: string): extension is keyof typeof mimeTypes {
    return extension in mimeTypes;
  }

  return createServer(async (req, res) => {
    try {
      const extension = parsePath(req.url ?? '').ext;
      if (!extension) {
        const data = await fs.readFile(join(directory, 'index.html'));
        res.writeHead(200, { "Content-Type": mimeTypes['.html'] });
        res.end(data);
      } else if (req.url) {
        const data = await fs.readFile(join(directory, req.url));
        const type = isMimeType(extension) ? mimeTypes[extension] : 'text/plain';
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
      } else {
        throw new Error(`No url in the request`)
      }
    } catch(err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
    }
  }).listen(port);
}
