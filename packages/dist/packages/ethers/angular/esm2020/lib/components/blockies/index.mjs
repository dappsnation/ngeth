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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvYmxvY2tpZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUcsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDOztBQVFoQyxNQUFNLE9BQU8saUJBQWlCO0lBaUI1QixZQUFvQixFQUEyQixFQUFVLFFBQW1CO1FBQXhELE9BQUUsR0FBRixFQUFFLENBQXlCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUFHLENBQUM7SUFaaEYsSUFDSSxPQUFPLENBQUMsT0FBa0M7UUFDNUMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVE7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkYsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7OEdBZlUsaUJBQWlCO2tHQUFqQixpQkFBaUIscUlBSmxCLDJCQUEyQjsyRkFJMUIsaUJBQWlCO2tCQU43QixTQUFTOytCQUNFLGNBQWMsWUFDZCwyQkFBMkIsbUJBRXBCLHVCQUF1QixDQUFDLE1BQU07eUhBS3pCLEtBQUs7c0JBQTFCLFdBQVc7dUJBQUMsT0FBTztnQkFHaEIsT0FBTztzQkFEVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgSW5wdXQsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBibG9ja2llcyBmcm9tICdibG9ja2llcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2V0aC1ibG9ja2llcycsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHN0eWxlVXJsczogWycuL3N0eWxlLnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgQmxvY2tpZXNDb21wb25lbnQge1xuICBwcml2YXRlIHByZXZpb3VzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG5cbiAgQEhvc3RCaW5kaW5nKCd0aXRsZScpIHRpdGxlPzogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBhZGRyZXNzKGFkZHJlc3M6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpIHtcbiAgICBpZiAoIWFkZHJlc3MpIHJldHVybjtcbiAgICB0aGlzLnRpdGxlID0gYWRkcmVzcztcbiAgICBpZiAodGhpcy5wcmV2aW91cykgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMucHJldmlvdXMpO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMucHJldmlvdXMgPSBibG9ja2llcyh7IHNlZWQ6IGFkZHJlc3MudG9Mb3dlckNhc2UoKSB9KTtcbiAgICB0aGlzLnByZXZpb3VzLnN0eWxlLndpZHRoID0gYCR7d2lkdGggfHwgMzJ9cHhgO1xuICAgIHRoaXMucHJldmlvdXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IHx8IDMyfXB4YDtcbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5wcmV2aW91cyk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxufSJdfQ==