import 'hardhat/types/config';
import { HardhatConfig } from 'hardhat/types';

interface NgEthConfig {
  outDir: string;
  /** Constructor params used when serving the application */
  autoDeploy: Record<string, unknown[]>;
  withImports: boolean;
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
  autoDeploy: {},
  withImports: false,
  ...(config.ngeth || {})
})
