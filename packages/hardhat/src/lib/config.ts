import 'hardhat/types/config';
import { HardhatConfig } from 'hardhat/types';

interface NgEthConfig {
  /** Path of the build output */
  outputPath: string;
  /** Constructor params used when serving the application */
  runs: string[] | { scripts: string[], parallel: boolean };
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
  outputPath: 'ngeth',
  runs: [],
  withImports: false,
  explorer: {
    api: 3000,
    app: 3001,
  },
  ...(config.ngeth || {})
})
