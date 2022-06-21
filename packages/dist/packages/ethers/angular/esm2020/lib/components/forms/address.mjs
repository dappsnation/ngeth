import { Directive, ElementRef, forwardRef, HostListener, Injector, Renderer2 } from "@angular/core";
import { NgControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { getAddress } from "@ethersproject/address";
import { EthValidators } from "../../form";
import * as i0 from "@angular/core";
export class AddressInputDirective {
    constructor(renderer, el, injector) {
        this.renderer = renderer;
        this.el = el;
        this.injector = injector;
        this.onChange = () => null;
        this.onTouch = () => null;
    }
    change(event) {
        this.onChange(event.target.value);
    }
    blur() {
        this.onTouch();
    }
    ngOnInit() {
        this.control = this.injector.get(NgControl)?.control;
        this.control?.addValidators(EthValidators.address);
    }
    setProperty(key, value) {
        this.renderer.setProperty(this.el.nativeElement, key, value);
    }
    async writeValue(value) {
        if (value) {
            this.setProperty('value', getAddress(value));
        }
        else {
            this.setProperty('value', '');
        }
    }
    registerOnChange(fn) {
        this.onChange = (value) => {
            this.control?.markAsDirty();
            fn(getAddress(value));
        };
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    setDisabledState(isDisabled) {
        this.setProperty('disabled', isDisabled);
    }
}
AddressInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: AddressInputDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive });
AddressInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.2", type: AddressInputDirective, selector: "input[type=\"ethAddress\"]", host: { listeners: { "change": "change($event)", "blur": "blur()" } }, providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressInputDirective),
            multi: true
        }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: AddressInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="ethAddress"]',
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => AddressInputDirective),
                            multi: true
                        }],
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.Injector }]; }, propDecorators: { change: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], blur: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2V0aGVycy9hbmd1bGFyL3NyYy9saWIvY29tcG9uZW50cy9mb3Jtcy9hZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFvQixTQUFTLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDN0gsT0FBTyxFQUFzRCxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQzs7QUFVM0MsTUFBTSxPQUFPLHFCQUFxQjtJQWFoQyxZQUNVLFFBQW1CLEVBQ25CLEVBQWdDLEVBQ2hDLFFBQWtCO1FBRmxCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7UUFDaEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQU5wQixhQUFRLEdBQStCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNsRCxZQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBTTFCLENBQUM7SUFkZ0MsTUFBTSxDQUFDLEtBQVk7UUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBRSxLQUFLLENBQUMsTUFBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ3FCLElBQUk7UUFDeEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFZRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFTyxXQUFXLENBQUMsR0FBVyxFQUFFLEtBQWM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQWE7UUFDNUIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBMkI7UUFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFjO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMzQyxDQUFDOztrSEFsRFUscUJBQXFCO3NHQUFyQixxQkFBcUIsNEhBTnRCLENBQUM7WUFDVCxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUM7WUFDcEQsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDOzJGQUVTLHFCQUFxQjtrQkFSakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsMEJBQTBCO29CQUNwQyxTQUFTLEVBQUMsQ0FBQzs0QkFDVCxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ1osQ0FBQztpQkFDSDtnSkFJcUMsTUFBTTtzQkFBekMsWUFBWTt1QkFBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBR1osSUFBSTtzQkFBekIsWUFBWTt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yLCBPbkluaXQsIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFNlbGYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUNvbnRyb2wsIE5nQ29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGdldEFkZHJlc3MgfSBmcm9tIFwiQGV0aGVyc3Byb2plY3QvYWRkcmVzc1wiO1xuaW1wb3J0IHsgRXRoVmFsaWRhdG9ycyB9IGZyb20gXCIuLi8uLi9mb3JtXCI7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJldGhBZGRyZXNzXCJdJyxcbiAgcHJvdmlkZXJzOlt7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWRkcmVzc0lucHV0RGlyZWN0aXZlKSxcbiAgICBtdWx0aTogdHJ1ZVxuICB9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWRkcmVzc0lucHV0RGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG4gIHByaXZhdGUgY29udHJvbD86IEFic3RyYWN0Q29udHJvbCB8IG51bGw7XG5cbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQnXSkgY2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgIHRoaXMub25DaGFuZ2UoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XG4gIH1cbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpIGJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoKCk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdW5rbm93biA9ICgpID0+IG51bGw7XG4gIHByaXZhdGUgb25Ub3VjaCA9ICgpID0+IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7fVxuICBcbiAgXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY29udHJvbCA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5nQ29udHJvbCk/LmNvbnRyb2w7XG4gICAgdGhpcy5jb250cm9sPy5hZGRWYWxpZGF0b3JzKEV0aFZhbGlkYXRvcnMuYWRkcmVzcylcbiAgfVxuXG4gIHByaXZhdGUgc2V0UHJvcGVydHkoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgYXN5bmMgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNldFByb3BlcnR5KCd2YWx1ZScsIGdldEFkZHJlc3ModmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBzdHJpbmcpID0+IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuY29udHJvbD8ubWFya0FzRGlydHkoKTtcbiAgICAgIGZuKGdldEFkZHJlc3ModmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gbnVsbCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eSgnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxufSJdfQ==