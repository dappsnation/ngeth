import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { Controller, createController } from 'ipfsd-ctl';
import * as ipfsHttpModule from 'ipfs-http-client';
import { path as ipfsPath } from 'ipfs';
import { join } from 'path';
import { Observable } from 'rxjs';
import { promises as fs, existsSync } from 'fs';


interface Options {
  /** Path the the folder where IPFS data is store. If not provided node will use global IPFS_PATH variable. */
  path?: string;
  /** The path to the ipfs config relative to root. It'll be merge with default config. */
  config?: string;
  /** A list of authorized URL for the CORS of the IPFS node. Default: `["http://localhost:4200"]` */
  cors: string[];
  /** If true, IPFS data will be clean once the node is stopped. Default false */
  disposable: boolean;
}

export default createBuilder((options: Options, context: BuilderContext): Observable<BuilderOutput> => {
  const root = context.workspaceRoot;
  const repo = join(root, options.path ?? '.ipfs');

  const log = (msg: string) => context.logger.info(msg);
  return new Observable(subscriber => {
    let node: Controller;
    // Setup the node
    const setup = async () => {
      
      // Clean the api file if any (this will prevent user to updat manually the api file...)
      // see: https://github.com/ipfs/js-ipfsd-ctl/issues/226#issuecomment-378770746
      if (!options.disposable) {
        const apiFile = join(repo, 'api');
        const lockFolder = join(repo, 'repo.lock');
        if (existsSync(apiFile)) {
          await Promise.all([
            fs.unlink(apiFile),
            fs.rm(lockFolder, { recursive: true }),
          ])
        }
      }

      // Initialize the controller
      const node = await createController({
        ipfsHttpModule,
        ipfsBin: ipfsPath(),
        disposable: options.disposable,
        ipfsOptions: {
          repo: options.path ? join(root, options.path) : undefined,
          config: options.config ? join(root, options.config) : undefined
        }
      });

      try {
        await node.api.id();
      } catch(err) {
        await node.start();
      }

      // Update CORS
      await node.api.config.set('API.HTTPHeaders.Access-Control-Allow-Origin', options.cors);      
      log('IPFS node started');
    }

    // Start the node
    setup()
      .then(() => subscriber.next({ success: true }))
      .catch((err) => subscriber.error({ success: false, error: err }));

    // Teardown logic: stop the node
    return () => node?.stop();
  })
});
