import { Component, ChangeDetectionStrategy, Input, ElementRef, Renderer2, HostBinding } from '@angular/core';
import blockies from 'blockies';
import * as i0 from "@angular/core";
export class BlockiesComponent {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    set address(address) {
        if (!address)
            return;
        this.title = address;
        if (this.previous)
            this.renderer.removeChild(this.el.nativeElement, this.previous);
        const { width, height } = this.el.nativeElement.getBoundingClientRect();
        this.previous = blockies({ seed: address.toLowerCase() });
        this.previous.style.width = `${width || 32}px`;
        this.previous.style.height = `${height || 32}px`;
        this.renderer.appendChild(this.el.nativeElement, this.previous);
    }
}
BlockiesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BlockiesComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
BlockiesComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: BlockiesComponent, selector: "eth-blockies", inputs: { address: "address" }, host: { properties: { "title": "this.title" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, styles: [":host{display:inline-block;overflow:hidden;border-radius:50%;aspect-ratio:1;line-height:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BlockiesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'eth-blockies', template: '<ng-content></ng-content>', changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:inline-block;overflow:hidden;border-radius:50%;aspect-ratio:1;line-height:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { title: [{
                type: HostBinding,
                args: ['title']
            }], address: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvYmxvY2tpZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUcsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDOztBQVFoQyxNQUFNLE9BQU8saUJBQWlCO0lBaUI1QixZQUFvQixFQUEyQixFQUFVLFFBQW1CO1FBQXhELE9BQUUsR0FBRixFQUFFLENBQXlCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUFHLENBQUM7SUFaaEYsSUFDSSxPQUFPLENBQUMsT0FBa0M7UUFDNUMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVE7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkYsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7OEdBZlUsaUJBQWlCO2tHQUFqQixpQkFBaUIscUlBSmxCLDJCQUEyQjsyRkFJMUIsaUJBQWlCO2tCQU43QixTQUFTOytCQUNFLGNBQWMsWUFDZCwyQkFBMkIsbUJBRXBCLHVCQUF1QixDQUFDLE1BQU07eUhBS3pCLEtBQUs7c0JBQTFCLFdBQVc7dUJBQUMsT0FBTztnQkFHaEIsT0FBTztzQkFEVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgSW5wdXQsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IGJsb2NraWVzIGZyb20gJ2Jsb2NraWVzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZXRoLWJsb2NraWVzJyxcclxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxyXG4gIHN0eWxlVXJsczogWycuL3N0eWxlLnNjc3MnXSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmxvY2tpZXNDb21wb25lbnQge1xyXG4gIHByaXZhdGUgcHJldmlvdXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCd0aXRsZScpIHRpdGxlPzogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCBhZGRyZXNzKGFkZHJlc3M6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpIHtcclxuICAgIGlmICghYWRkcmVzcykgcmV0dXJuO1xyXG4gICAgdGhpcy50aXRsZSA9IGFkZHJlc3M7XHJcbiAgICBpZiAodGhpcy5wcmV2aW91cykgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMucHJldmlvdXMpO1xyXG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLnByZXZpb3VzID0gYmxvY2tpZXMoeyBzZWVkOiBhZGRyZXNzLnRvTG93ZXJDYXNlKCkgfSk7XHJcbiAgICB0aGlzLnByZXZpb3VzLnN0eWxlLndpZHRoID0gYCR7d2lkdGggfHwgMzJ9cHhgO1xyXG4gICAgdGhpcy5wcmV2aW91cy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgfHwgMzJ9cHhgO1xyXG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMucHJldmlvdXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cclxufSJdfQ==