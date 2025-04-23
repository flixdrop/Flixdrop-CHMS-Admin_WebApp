import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pagenotfound',
  imports: [ CommonModule, IonicModule, RouterModule ],
  standalone: true,
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss'],
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
