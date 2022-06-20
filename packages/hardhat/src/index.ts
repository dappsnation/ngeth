import './lib/config';
import { extendConfig, task } from 'hardhat/config';
import { dirname, join, relative, resolve } from 'path';
import { generate } from './lib/generate';
import { getDefaultConfig } from './lib/config';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { getContractImport } from '@ngeth/tools';
import { execute } from './lib/execute';
import { serveApp } from './lib/utils';


export * from './lib/deploy';

extendConfig((config) => {
  config.ngeth = getDefaultConfig(config)
});

task('ngeth:test', 'Run test with jest')
  .addOptionalParam('jestconfig', 'Jest configuration path', 'jest.config.js')
  .setAction(async (taskArguments: any, hre: any) => {
    const { runCLI } = await import('jest');
    const root = hre.config.paths.root;
    const configPath = taskArguments.jestconfig;
    const jestConfig: any = { watch: taskArguments.watch ?? false };
    const failures = await runCLI(jestConfig, [join(root, configPath)]);
    process.exitCode = failures.results.success ? 0 : 1;
  });

task('ngeth:build', 'Build the contracts and generate outputs')
  .setAction(async (taskArguments: any, hre) => {
    await hre.run('compile', taskArguments);
    // Generate contracts & index.ts
    const root = hre.config.paths.root;
    const outputPath = join(root, hre.config.ngeth.outputPath);
    if (!existsSync(outputPath)) mkdirSync(outputPath, { recursive: true });

    const paths = await hre.artifacts.getAllFullyQualifiedNames();
    const artifacts = await Promise.all(paths.map(path => hre.artifacts.readArtifact(path)));
    await generate(hre, artifacts);
  });

task('ngeth:serve')
  .setAction(async (taskArguments: any, hre) => {
    hre.hardhatArguments.network = 'localhost';
    await hre.run('ngeth:build', taskArguments);
    return hre.run('node', taskArguments);
  });

task('node:server-ready', 'Run once the node is ready')
  .setAction(async (taskArguments: any, hre, runSuper: any) => {
    await runSuper();

    const paths = await hre.artifacts.getAllFullyQualifiedNames();
    const artifacts = await Promise.all(paths.map(path => hre.artifacts.readArtifact(path)));
    const root = hre.config.paths.root;
    const outputPath = join(root, hre.config.ngeth.outputPath);
    if (!existsSync(outputPath)) mkdirSync(outputPath, { recursive: true });

   
    // Generate contracts & index.ts
    generate(hre, artifacts);


    // Generate imports
    if (hre.config.ngeth.withImports) {
      // Generate imports
      // TODO: check if bytecode === "0x" -> interface / abstract
      const src = resolve(hre.config.paths.sources);
      const importArtifacts = artifacts.filter(a => !resolve(a.sourceName).startsWith(src));
      const importFolder = join(outputPath, 'imports');
      
      for (const artifact of importArtifacts) {
        if (!artifact.abi.length) continue; // No public API
        const contractName = artifact.contractName;
        const contract = getContractImport(contractName, artifact.abi);
        const output = join(importFolder, dirname(artifact.sourceName));
        if (!existsSync(output)) mkdirSync(output, { recursive: true });
        fs.writeFile(join(output, `${contractName}.ts`), contract);
      }
      const exportImports = importArtifacts
        .filter(artifact => artifact.abi.length)
        .map(artifact => `export * from "./${dirname(artifact.sourceName)}/${artifact.contractName}";`)
        .join('\n');
      fs.writeFile(join(importFolder, 'index.ts'), exportImports);
    }

    // Explorer
    if (hre.config.ngeth.explorer) {
      const { api, app } = hre.config.ngeth.explorer;
      const artifactsSuffix = relative(root, hre.config.paths.artifacts);
      const sourcesSuffix = relative(root, hre.config.paths.sources);

      // API
      const artifactRoot = join(root, artifactsSuffix, sourcesSuffix);
      const cwd = __dirname;
      const env = {
        ARTIFACTS_ROOT: artifactRoot,
        EXPLORER_APP_PORT: app.toString(),
        EXPLORER_API_PORT: api.toString()
      };
      execute('node explorer/api/main.js', { cwd, env });
      
      // APP
      const appPath = join(cwd, 'explorer/app');
      const appConfig = JSON.stringify({ api: `http://localhost:${api}` });
      await fs.writeFile(join(appPath, 'assets/config.json'), appConfig);
      serveApp(appPath, app);

      console.table([
        { 'Explorer API': `http://localhost:${api}`, 'Explorer APP:': `http://localhost:${app}` }, 
      ]);
    }

    // Runs
    if (hre.config.ngeth.runs) {
      const runs = Array.isArray(hre.config.ngeth.runs)
        ? { scripts: hre.config.ngeth.runs, parallel: false }
        : hre.config.ngeth.runs;
      
      for (const path of runs.scripts) {
        const script = join(hre.config.paths.root, path);
        if (runs.parallel) {
          hre.run('run', { script, noCompile: true });
        } else {
          await hre.run('run', { script, noCompile: true });
        }
      }
    }
  });