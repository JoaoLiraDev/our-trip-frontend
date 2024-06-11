
import { Component, Input, OnDestroy, OnInit, inject, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';

import { ReplaySubject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Destino } from '@pages/destinos/interfaces/destino.interface';

@Component({
  standalone: true,
  selector: 'app-expandable-card',
  templateUrl: './expandable-card.component.html',
  styleUrl: './expandable-card.component.scss',
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CurrencyPipe
  ]
})
export class ExpandableCardComponent implements OnInit {
  private _router = inject(Router);
  @Input() data!: Destino;

  ngOnInit() {
 console.log(this.data)
  }
  panelOpenState = false;
  state = 'collapsed';

  toggle(): void {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }

  redirectToPurchase(id: string) {
    this._router.navigate(['/comprar'], { queryParams: { id } })
  }

}
