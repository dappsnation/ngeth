import { resolve, join, parse as parsePath } from "path";
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettier from "prettier/standalone";
import { promises as fs } from 'fs';
import { createServer } from 'http';
import { Artifact, BuildInfo, HardhatRuntimeEnvironment } from "hardhat/types";
import { getNatspec, Natspec } from "@ngeth/tools";

interface CompiledOutput extends Artifact {
  natspec?: Natspec;
}

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

export async function getCompiledOutput(hre: HardhatRuntimeEnvironment) {
  const readJson = (path: string) => fs.readFile(path, 'utf-8').then(file => JSON.parse(file));
  // const readJsonFiles = (paths: string[]) => Promise.all(paths.map(readJson));
  // const getArtifacts = () => hre.artifacts.getArtifactPaths().then(readJsonFiles);
  // const getBuildInfos = () => hre.artifacts.getBuildInfoPaths().then(readJsonFiles);
  // const [artifacts, buildInfos] = await Promise.all([
  //   getArtifacts(),
  //   getBuildInfos(),
  // ]);
  const outputs: Record<string, Record<string, CompiledOutput>> = {};

  const queryBuildInfos: Record<string, Promise<BuildInfo>> = {};
  const paths = await hre.artifacts.getArtifactPaths();
  for (const path of paths) {
    const debugPath = path.replace('.json', '.dbg.json');
    const getBuildInfo = readJson(debugPath).then(({ buildInfo }) => {
      const buildInfoPath = join(path, '..', buildInfo);
      if (!queryBuildInfos[buildInfoPath]) queryBuildInfos[buildInfoPath] = readJson(buildInfoPath);
      return queryBuildInfos[buildInfoPath];
    });
    const [arfitact, buildInfo] = await Promise.all([
      readJson(path),
      getBuildInfo
    ]);
   
    const { sourceName, contractName } = arfitact;
    if (!outputs[sourceName]) outputs[sourceName] = {};
    outputs[sourceName][contractName] = arfitact;
    const doc = getNatspec(buildInfo.output.sources[sourceName].ast);
    for (const [contractName, natspec] of Object.entries(doc)) {
      outputs[sourceName][contractName].natspec = natspec;
    }
  }


  // const outputs: Record<string, Record<string, CompiledOutput>> = {};
  // for (const arfitact of artifacts as Artifact[]) {
  //   const { sourceName, contractName } = arfitact;
  //   if (!outputs[sourceName]) outputs[sourceName] = {};
  //   outputs[sourceName][contractName] = arfitact;
  // }
  // for (const info of buildInfos as BuildInfo[]) {
  //   for (const [sourceName, source] of Object.entries(info.output.sources)) {
  //     if (!outputs[sourceName]) outputs[sourceName] = {};
  //     const doc = getNatspec(source.ast);
  //     for (const [contractName, natspec] of Object.entries(doc)) {
  //       outputs[sourceName][contractName].natspec = natspec;
  //     }
  //   }
  // }
  console.log('GOT AN OUTPUT');
  return Object.values(outputs).map(file => Object.values(file)).flat();
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
