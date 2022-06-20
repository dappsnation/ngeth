import { Provider } from '@ethersproject/providers';
import { Networkish } from '@ethersproject/networks';
export declare function rpcProvider(network?: Networkish, options?: any): {
    provide: typeof Provider;
    useFactory: () => import("@ethersproject/providers").BaseProvider;
};
