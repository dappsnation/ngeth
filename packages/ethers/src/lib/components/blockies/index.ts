import { Component, ChangeDetectionStrategy, Input, ElementRef, Renderer2, HostBinding } from '@angular/core';
import blockies from 'blockies';

@Component({
  selector: 'eth-blockies',
  template: '<ng-content></ng-content>',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockiesComponent {
  private previous?: HTMLCanvasElement;

  @HostBinding('title') title?: string;

  @Input()
  set address(address: string) {
    if (!address) return;
    this.title = address;
    if (this.previous) this.renderer.removeChild(this.el.nativeElement, this.previous);
    const { width, height } = this.el.nativeElement.getBoundingClientRect();
    this.previous = blockies({ seed: address.toLowerCase() });
    this.previous.style.width = `${width || 32}px`;
    this.previous.style.height = `${height || 32}px`;
    this.renderer.appendChild(this.el.nativeElement, this.previous);
  }

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}
}