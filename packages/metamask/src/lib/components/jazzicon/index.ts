import { ChangeDetectionStrategy, Component, HostBinding, Input } from "@angular/core";
import MersenneTwister from "mersenne-twister";
import { colorRotate } from "./utils";

// See: https://github.com/marcusmolchany/react-jazzicon

export default function seedFromAddress(address: string): number {
  const addr = address.slice(2, 10);
  return parseInt(addr, 16);
}

const colors = Object.freeze([
	'#01888C', // teal
  '#FC7500', // bright orange
  '#034F5D', // dark teal
  '#F73F01', // orangered
  '#FC1960', // magenta
  '#C7144C', // raspberry
  '#F3C100', // goldenrod
  '#1598F2', // lightning blue
  '#2465E1', // sail blue
  '#F19E02', // gold
] as const);

type Color = typeof colors[number];

const shapeCount = 4;
const total = shapeCount - 1;
const wobble = 30;
const diameter = 100;

interface Shape {
  transform: string;
  fill: string;
}

@Component({
  selector: 'metamask-jazzicon',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JazzIconComponent {
  private generator!: MersenneTwister;
  diameter = 0;
  shapes: Shape[] = [];

  @HostBinding('style.backgroundColor') background?: string;
  @HostBinding('title') title?: string;
  
  @Input()
  set address(address: string) {
    if (!address) return;
    this.title = address;
    this.generate(address);
  }

  private async generate(address: string) {
    const seed = seedFromAddress(address);
    this.generator = new MersenneTwister(seed);
    const remainingColors = this.hueShift(colors.slice(), this.generator);
    this.background = this.genColor(remainingColors);
    this.shapes = Array(total).fill(undefined).map((_, i) => this.getShape(remainingColors, i))
  }

  private genColor(colors: Color[]): string {
    const rand = this.generator.random(); // purposefully call the generator once, before using it again on the next line
    const idx = Math.floor(colors.length * this.generator.random());
    return colors.splice(idx, 1)[0];
  }

  private hueShift(colors: Color[], generator: MersenneTwister): Color[] {
    const amount = generator.random() * 30 - wobble / 2;
    const rotate = (hex: string) => colorRotate(hex, amount) as Color;
    return colors.map(rotate);
  }

  private getShape(remainingColors: Color[], i: number) {
    const center = diameter / 2;
    const firstRot = this.generator.random();
    const angle = Math.PI * 2 * firstRot;
    const velocity = (diameter / total) * this.generator.random() + (i * diameter) / total;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    const translate = `translate(${tx}, ${ty})`;

    // Third random is a shape rotation on top of all of that.
    const secondRot = this.generator.random();
    const rot = firstRot * 360 + secondRot * 180;
    const rotate =`rotate(${rot.toFixed(1)} ${center} ${center})`;
    const transform = `${translate} ${rotate}`;
    const fill = this.genColor(remainingColors);
    return { transform, fill };
  }
}