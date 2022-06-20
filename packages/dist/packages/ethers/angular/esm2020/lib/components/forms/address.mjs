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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2V0aGVycy9hbmd1bGFyL3NyYy9saWIvY29tcG9uZW50cy9mb3Jtcy9hZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFvQixTQUFTLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDN0gsT0FBTyxFQUFzRCxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQzs7QUFVM0MsTUFBTSxPQUFPLHFCQUFxQjtJQWFoQyxZQUNVLFFBQW1CLEVBQ25CLEVBQWdDLEVBQ2hDLFFBQWtCO1FBRmxCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7UUFDaEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQU5wQixhQUFRLEdBQStCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNsRCxZQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBTTFCLENBQUM7SUFkZ0MsTUFBTSxDQUFDLEtBQVk7UUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBRSxLQUFLLENBQUMsTUFBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ3FCLElBQUk7UUFDeEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFZRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFTyxXQUFXLENBQUMsR0FBVyxFQUFFLEtBQWM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQWE7UUFDNUIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBMkI7UUFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFjO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMzQyxDQUFDOztrSEFsRFUscUJBQXFCO3NHQUFyQixxQkFBcUIsNEhBTnRCLENBQUM7WUFDVCxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUM7WUFDcEQsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDOzJGQUVTLHFCQUFxQjtrQkFSakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsMEJBQTBCO29CQUNwQyxTQUFTLEVBQUMsQ0FBQzs0QkFDVCxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ1osQ0FBQztpQkFDSDtnSkFJcUMsTUFBTTtzQkFBekMsWUFBWTt1QkFBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBR1osSUFBSTtzQkFBekIsWUFBWTt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yLCBPbkluaXQsIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFNlbGYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTmdDb250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBnZXRBZGRyZXNzIH0gZnJvbSBcIkBldGhlcnNwcm9qZWN0L2FkZHJlc3NcIjtcclxuaW1wb3J0IHsgRXRoVmFsaWRhdG9ycyB9IGZyb20gXCIuLi8uLi9mb3JtXCI7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJldGhBZGRyZXNzXCJdJyxcclxuICBwcm92aWRlcnM6W3tcclxuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWRkcmVzc0lucHV0RGlyZWN0aXZlKSxcclxuICAgIG11bHRpOiB0cnVlXHJcbiAgfV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBZGRyZXNzSW5wdXREaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0IHtcclxuICBwcml2YXRlIGNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2wgfCBudWxsO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnLCBbJyRldmVudCddKSBjaGFuZ2UoZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlKChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpO1xyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdibHVyJykgYmx1cigpIHtcclxuICAgIHRoaXMub25Ub3VjaCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHVua25vd24gPSAoKSA9PiBudWxsO1xyXG4gIHByaXZhdGUgb25Ub3VjaCA9ICgpID0+IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxyXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcclxuICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yXHJcbiAgKSB7fVxyXG4gIFxyXG4gIFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5jb250cm9sID0gdGhpcy5pbmplY3Rvci5nZXQoTmdDb250cm9sKT8uY29udHJvbDtcclxuICAgIHRoaXMuY29udHJvbD8uYWRkVmFsaWRhdG9ycyhFdGhWYWxpZGF0b3JzLmFkZHJlc3MpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFByb3BlcnR5KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGtleSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCBnZXRBZGRyZXNzKHZhbHVlKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFByb3BlcnR5KCd2YWx1ZScsICcnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiBudWxsKTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgdGhpcy5jb250cm9sPy5tYXJrQXNEaXJ0eSgpO1xyXG4gICAgICBmbihnZXRBZGRyZXNzKHZhbHVlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gbnVsbCk6IHZvaWQge1xyXG4gICAgdGhpcy5vblRvdWNoID0gZm47XHJcbiAgfVxyXG5cclxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0UHJvcGVydHkoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XHJcbiAgfVxyXG59Il19