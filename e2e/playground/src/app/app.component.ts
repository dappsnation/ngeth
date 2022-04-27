import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public hasProvider = !!window && ('ethereum' in window);
  constructor(private router: Router) {}


  redirect(path: string) {
    this.router.navigate([path]);
  }
}
