import 'hardhat/types/config';
import { HardhatConfig } from 'hardhat/types';

interface NgEthConfig {
  outDir: string;
  /** Constructor params used when serving the application */
  exec: string[] | { scripts: string[], parallel: boolean };
  autoDeploy: Record<string, unknown[]>;
  withImports: boolean;
  /** Ports for the explorer api & app */
  explorer: false | { api: number, app: number }
}

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    ngeth?: Partial<NgEthConfig>
  }

  interface HardhatConfig {
    ngeth: NgEthConfig
  }
}

export const getDefaultConfig = (config: Partial<HardhatConfig>): NgEthConfig => ({
  outDir: 'ngeth',
  exec: [],
  autoDeploy: {},
  withImports: false,
  explorer: {
    api: 3000,
    app: 3001,
  },
  ...(config.ngeth || {})
})
