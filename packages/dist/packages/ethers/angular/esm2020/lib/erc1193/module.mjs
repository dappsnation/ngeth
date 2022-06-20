import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { ERC1193 } from './service';
export function ethersProviders(erc1193) {
    return [{
            provide: ERC1193,
            useClass: erc1193
        }, {
            provide: Provider,
            useFactory: (erc1193) => erc1193.ethersProvider,
            deps: [ERC1193]
        }, {
            provide: Signer,
            useFactory: (erc1193) => erc1193.ethersSigner,
            deps: [ERC1193]
        }];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vZXRoZXJzL2FuZ3VsYXIvc3JjL2xpYi9lcmMxMTkzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDNUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3hELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFJcEMsTUFBTSxVQUFVLGVBQWUsQ0FBMEIsT0FBeUI7SUFDaEYsT0FBTyxDQUFDO1lBQ04sT0FBTyxFQUFFLE9BQU87WUFDaEIsUUFBUSxFQUFFLE9BQU87U0FDbEIsRUFBQztZQUNBLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFVBQVUsRUFBRSxDQUFDLE9BQWdCLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjO1lBQ3hELElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztTQUNoQixFQUFFO1lBQ0QsT0FBTyxFQUFFLE1BQU07WUFDZixVQUFVLEVBQUUsQ0FBQyxPQUFnQixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWTtZQUN0RCxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDaEIsQ0FBQyxDQUFBO0FBRUosQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9hYnN0cmFjdC1wcm92aWRlcic7XHJcbmltcG9ydCB7IFNpZ25lciB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L2Fic3RyYWN0LXNpZ25lcic7XHJcbmltcG9ydCB7IEVSQzExOTMgfSBmcm9tICcuL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBXYWxsZXRQcm9maWxlIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV0aGVyc1Byb3ZpZGVyczxUIGV4dGVuZHMgV2FsbGV0UHJvZmlsZT4oZXJjMTE5MzogVHlwZTxFUkMxMTkzPFQ+Pikge1xyXG4gIHJldHVybiBbe1xyXG4gICAgcHJvdmlkZTogRVJDMTE5MyxcclxuICAgIHVzZUNsYXNzOiBlcmMxMTkzXHJcbiAgfSx7XHJcbiAgICBwcm92aWRlOiBQcm92aWRlcixcclxuICAgIHVzZUZhY3Rvcnk6IChlcmMxMTkzOiBFUkMxMTkzKSA9PiBlcmMxMTkzLmV0aGVyc1Byb3ZpZGVyLFxyXG4gICAgZGVwczogW0VSQzExOTNdXHJcbiAgfSwge1xyXG4gICAgcHJvdmlkZTogU2lnbmVyLFxyXG4gICAgdXNlRmFjdG9yeTogKGVyYzExOTM6IEVSQzExOTMpID0+IGVyYzExOTMuZXRoZXJzU2lnbmVyLFxyXG4gICAgZGVwczogW0VSQzExOTNdXHJcbiAgfV1cclxuICBcclxufVxyXG4iXX0=