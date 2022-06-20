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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvZm9ybXMvZXRoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQVUzQyxNQUFNLE9BQU8sbUJBQW1CO0lBZ0I5QixZQUNVLFlBQTBCLEVBQzFCLFFBQW1CLEVBQ25CLEVBQWdDO1FBRmhDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7UUFObEMsYUFBUSxHQUErQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbEQsWUFBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztJQU16QixDQUFDO0lBbEJMLElBQWEsT0FBTyxDQUFDLEVBQWtCO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVtQyxNQUFNLENBQUMsS0FBWTtRQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxNQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDcUIsSUFBSTtRQUN4QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQVdPLFdBQVcsQ0FBQyxHQUFXLEVBQUUsS0FBYztRQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBbUI7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ2IsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQW1CO1FBQ2xDLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3BGO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFpQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDaEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQWM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7O2dIQXhEVSxtQkFBbUI7b0dBQW5CLG1CQUFtQix1SkFOcEIsQ0FBQztZQUNULE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUNsRCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUM7MkZBRVMsbUJBQW1CO2tCQVIvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFNBQVMsRUFBQyxDQUFDOzRCQUNULE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDOzRCQUNsRCxLQUFLLEVBQUUsSUFBSTt5QkFDWixDQUFDO2lCQUNIO29KQUdjLE9BQU87c0JBQW5CLEtBQUs7Z0JBSThCLE1BQU07c0JBQXpDLFlBQVk7dUJBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUdaLElBQUk7c0JBQXpCLFlBQVk7dUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgUmVuZGVyZXIyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XHJcbmltcG9ydCB0eXBlIHsgQmlnTnVtYmVyaXNoIH0gZnJvbSBcImV0aGVyc1wiO1xyXG5pbXBvcnQgeyBmb3JtYXRVbml0cywgcGFyc2VVbml0cyB9IGZyb20gXCJAZXRoZXJzcHJvamVjdC91bml0c1wiO1xyXG5pbXBvcnQgeyBDaGFpbiwgQ2hhaW5JZCB9IGZyb20gXCJAbmdldGgvZXRoZXJzLWNvcmVcIjtcclxuaW1wb3J0IHsgQ2hhaW5NYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2NoYWluXCI7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJldGhlclwiXScsXHJcbiAgcHJvdmlkZXJzOlt7XHJcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEV0aGVySW5wdXREaXJlY3RpdmUpLFxyXG4gICAgbXVsdGk6IHRydWVcclxuICB9XSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEV0aGVySW5wdXREaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgY2hhaW4/OiBDaGFpbjtcclxuICBASW5wdXQoKSBzZXQgY2hhaW5JZChpZDogQ2hhaW5JZCB8IG51bGwpIHtcclxuICAgIHRoaXMuc2V0Q2hhaW4oaWQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQnXSkgY2hhbmdlKGV2ZW50OiBFdmVudCkge1xyXG4gICAgdGhpcy5vbkNoYW5nZSgoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKTtcclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpIGJsdXIoKSB7XHJcbiAgICB0aGlzLm9uVG91Y2goKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB1bmtub3duID0gKCkgPT4gbnVsbDtcclxuICBwcml2YXRlIG9uVG91Y2ggPSAoKSA9PiBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgY2hhaW5NYW5hZ2VyOiBDaGFpbk1hbmFnZXIsXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxyXG4gICkgeyB9XHJcblxyXG4gIHByaXZhdGUgc2V0UHJvcGVydHkoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWwubmF0aXZlRWxlbWVudCwga2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHNldENoYWluKGlkPzogQ2hhaW5JZCB8IG51bGwpIHtcclxuICAgIHRoaXMuY2hhaW4gPSBpZFxyXG4gICAgICA/IGF3YWl0IHRoaXMuY2hhaW5NYW5hZ2VyLmdldENoYWluKGlkKVxyXG4gICAgICA6IGF3YWl0IHRoaXMuY2hhaW5NYW5hZ2VyLmdldENoYWluKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgZGVjaW1hbHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGFpbj8ubmF0aXZlQ3VycmVuY3kuZGVjaW1hbHM7XHJcbiAgfVxyXG4gIFxyXG4gIGFzeW5jIHdyaXRlVmFsdWUodmFsdWU6IEJpZ051bWJlcmlzaCkge1xyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0VW5pdHModmFsdWUsIHRoaXMuY2hhaW4/Lm5hdGl2ZUN1cnJlbmN5LmRlY2ltYWxzKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFByb3BlcnR5KCd2YWx1ZScsICcnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogQmlnTnVtYmVyaXNoKSA9PiBudWxsKTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgZm4ocGFyc2VVbml0cyh2YWx1ZSwgdGhpcy5kZWNpbWFscykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IG51bGwpOiB2b2lkIHtcclxuICAgIHRoaXMub25Ub3VjaCA9IGZuO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLnNldFByb3BlcnR5KCdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xyXG4gIH1cclxufSJdfQ==