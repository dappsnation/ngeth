import { Inject, LOCALE_ID, Pipe } from '@angular/core';
import { formatERC20 } from './utils';
import * as i0 from "@angular/core";
export class ERC20Pipe {
    constructor(_locale) {
        this._locale = _locale;
    }
    transform(balance, metadata, digitInfo) {
        return formatERC20(balance, metadata, digitInfo, this._locale);
    }
}
ERC20Pipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Pipe, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Pipe });
ERC20Pipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: ERC20Pipe, name: "erc20" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Pipe, decorators: [{
            type: Pipe,
            args: [{ name: 'erc20' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL3Rva2Vucy9lcmMyMC9waXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBR3ZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBSXRDLE1BQU0sT0FBTyxTQUFTO0lBQ3BCLFlBQXVDLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUMxRCxTQUFTLENBQUMsT0FBa0IsRUFBRSxRQUF1QixFQUFFLFNBQWtCO1FBQ3ZFLE9BQU8sV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoRSxDQUFDOztzR0FKVSxTQUFTLGtCQUNBLFNBQVM7b0dBRGxCLFNBQVM7MkZBQVQsU0FBUztrQkFEckIsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7OzBCQUVSLE1BQU07MkJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgTE9DQUxFX0lELCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJpZ051bWJlciB9IGZyb20gJ2V0aGVycyc7XHJcbmltcG9ydCB7IEVSQzIwTWV0YWRhdGEgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgZm9ybWF0RVJDMjAgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcblxyXG5AUGlwZSh7IG5hbWU6ICdlcmMyMCcgfSlcclxuZXhwb3J0IGNsYXNzIEVSQzIwUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9sb2NhbGU6IHN0cmluZykge31cclxuICB0cmFuc2Zvcm0oYmFsYW5jZTogQmlnTnVtYmVyLCBtZXRhZGF0YTogRVJDMjBNZXRhZGF0YSwgZGlnaXRJbmZvPzogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0RVJDMjAoYmFsYW5jZSwgbWV0YWRhdGEsIGRpZ2l0SW5mbywgdGhpcy5fbG9jYWxlKVxyXG4gIH1cclxufSJdfQ==