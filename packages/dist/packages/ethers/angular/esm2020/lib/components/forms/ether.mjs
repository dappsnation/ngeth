import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { ChainManager } from "../../chain";
import * as i0 from "@angular/core";
import * as i1 from "../../chain";
export class EtherInputDirective {
    constructor(chainManager, renderer, el) {
        this.chainManager = chainManager;
        this.renderer = renderer;
        this.el = el;
        this.onChange = () => null;
        this.onTouch = () => null;
    }
    set chainId(id) {
        this.setChain(id);
    }
    change(event) {
        this.onChange(event.target.value);
    }
    blur() {
        this.onTouch();
    }
    setProperty(key, value) {
        this.renderer.setProperty(this.el.nativeElement, key, value);
    }
    async setChain(id) {
        this.chain = id
            ? await this.chainManager.getChain(id)
            : await this.chainManager.getChain();
    }
    get decimals() {
        return this.chain?.nativeCurrency.decimals;
    }
    async writeValue(value) {
        if (value) {
            this.setProperty('value', formatUnits(value, this.chain?.nativeCurrency.decimals));
        }
        else {
            this.setProperty('value', '');
        }
    }
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(parseUnits(value, this.decimals));
        };
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    setDisabledState(isDisabled) {
        this.setProperty('disabled', isDisabled);
    }
}
EtherInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EtherInputDirective, deps: [{ token: i1.ChainManager }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
EtherInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.2", type: EtherInputDirective, selector: "input[type=\"ether\"]", inputs: { chainId: "chainId" }, host: { listeners: { "change": "change($event)", "blur": "blur()" } }, providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EtherInputDirective),
            multi: true
        }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EtherInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="ether"]',
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => EtherInputDirective),
                            multi: true
                        }],
                }]
        }], ctorParameters: function () { return [{ type: i1.ChainManager }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { chainId: [{
                type: Input
            }], change: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], blur: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvZm9ybXMvZXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQVUzQyxNQUFNLE9BQU8sbUJBQW1CO0lBZ0I5QixZQUNVLFlBQTBCLEVBQzFCLFFBQW1CLEVBQ25CLEVBQWdDO1FBRmhDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7UUFObEMsYUFBUSxHQUErQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbEQsWUFBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztJQU16QixDQUFDO0lBbEJMLElBQWEsT0FBTyxDQUFDLEVBQWtCO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVtQyxNQUFNLENBQUMsS0FBWTtRQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxNQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDcUIsSUFBSTtRQUN4QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQVdPLFdBQVcsQ0FBQyxHQUFXLEVBQUUsS0FBYztRQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBbUI7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ2IsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQW1CO1FBQ2xDLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3BGO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFpQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDaEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQWM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7O2dIQXhEVSxtQkFBbUI7b0dBQW5CLG1CQUFtQix1SkFOcEIsQ0FBQztZQUNULE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUNsRCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUM7MkZBRVMsbUJBQW1CO2tCQVIvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFNBQVMsRUFBQyxDQUFDOzRCQUNULE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDOzRCQUNsRCxLQUFLLEVBQUUsSUFBSTt5QkFDWixDQUFDO2lCQUNIO29KQUdjLE9BQU87c0JBQW5CLEtBQUs7Z0JBSThCLE1BQU07c0JBQXpDLFlBQVk7dUJBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUdaLElBQUk7c0JBQXpCLFlBQVk7dUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgUmVuZGVyZXIyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHR5cGUgeyBCaWdOdW1iZXJpc2ggfSBmcm9tIFwiZXRoZXJzXCI7XG5pbXBvcnQgeyBmb3JtYXRVbml0cywgcGFyc2VVbml0cyB9IGZyb20gXCJAZXRoZXJzcHJvamVjdC91bml0c1wiO1xuaW1wb3J0IHsgQ2hhaW4sIENoYWluSWQgfSBmcm9tIFwiQG5nZXRoL2V0aGVycy1jb3JlXCI7XG5pbXBvcnQgeyBDaGFpbk1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vY2hhaW5cIjtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1cImV0aGVyXCJdJyxcbiAgcHJvdmlkZXJzOlt7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRXRoZXJJbnB1dERpcmVjdGl2ZSksXG4gICAgbXVsdGk6IHRydWVcbiAgfV0sXG59KVxuZXhwb3J0IGNsYXNzIEV0aGVySW5wdXREaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIGNoYWluPzogQ2hhaW47XG4gIEBJbnB1dCgpIHNldCBjaGFpbklkKGlkOiBDaGFpbklkIHwgbnVsbCkge1xuICAgIHRoaXMuc2V0Q2hhaW4oaWQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQnXSkgY2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgIHRoaXMub25DaGFuZ2UoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XG4gIH1cbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpIGJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoKCk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdW5rbm93biA9ICgpID0+IG51bGw7XG4gIHByaXZhdGUgb25Ub3VjaCA9ICgpID0+IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjaGFpbk1hbmFnZXI6IENoYWluTWFuYWdlcixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgKSB7IH1cblxuICBwcml2YXRlIHNldFByb3BlcnR5KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0Q2hhaW4oaWQ/OiBDaGFpbklkIHwgbnVsbCkge1xuICAgIHRoaXMuY2hhaW4gPSBpZFxuICAgICAgPyBhd2FpdCB0aGlzLmNoYWluTWFuYWdlci5nZXRDaGFpbihpZClcbiAgICAgIDogYXdhaXQgdGhpcy5jaGFpbk1hbmFnZXIuZ2V0Q2hhaW4oKTtcbiAgfVxuXG4gIGdldCBkZWNpbWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFpbj8ubmF0aXZlQ3VycmVuY3kuZGVjaW1hbHM7XG4gIH1cbiAgXG4gIGFzeW5jIHdyaXRlVmFsdWUodmFsdWU6IEJpZ051bWJlcmlzaCkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXRVbml0cyh2YWx1ZSwgdGhpcy5jaGFpbj8ubmF0aXZlQ3VycmVuY3kuZGVjaW1hbHMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBCaWdOdW1iZXJpc2gpID0+IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIGZuKHBhcnNlVW5pdHModmFsdWUsIHRoaXMuZGVjaW1hbHMpKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gbnVsbCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eSgnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxufSJdfQ==