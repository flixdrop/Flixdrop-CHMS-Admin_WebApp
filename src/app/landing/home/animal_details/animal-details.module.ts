import { AnimalDetailsComponent } from "./animal-details.component";
import { IonicModule } from "@ionic/angular";
import { AnimalDetailsRoutingModule } from "./animal-details-routing.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [AnimalDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AnimalDetailsRoutingModule,
    TranslateModule
  ],
})
export class AnimalDetailsModule {}
