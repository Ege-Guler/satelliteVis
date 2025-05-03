import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
      this.matIconRegistry.addSvgIcon(
        "github",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/github.svg")
      )
    }
}
