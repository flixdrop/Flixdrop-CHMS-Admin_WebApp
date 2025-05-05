import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { InputHandlerService } from "src/app/services/input-handler/input-handler.service";
import { SortTableService } from "src/app/services/sort-table/sort-table.service";
import { NgxPaginationModule } from "ngx-pagination";

@Component({
  selector: "app-fertilityratio",
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule, NgxPaginationModule],
  templateUrl: "./fertilityratio.component.html",
  styleUrls: ["./fertilityratio.component.scss"],
})
export class FertilityRatioComponent implements OnInit {

  private fetchUserDataSub: Subscription;
  private userDataSub: Subscription;
  private getAllAnimalsSub: Subscription;
  private getFarmAnimalsSub: Subscription;

  activeRange: number = 7;

  results: any[] = [];
  animals: any[] = [];
  healthEvents: any[] = [];
  heatEvents: any[] = [];
  inseminations: any[] = [];
  pregnancyEvents: any[] = [];
  milkings: any[] = [];

  sortOrders = {};
  csvdata = [];

  startDate: string;
  endDate: string;

  fromDate: string;
  toDate: string;
  maxDate: string;
  isLoading: boolean = false;

  private farmIdSubscription: Subscription;

  p: number = 1;
  progress:number = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private inputHandlerService: InputHandlerService,
    private sortHandlerService: SortTableService,
  ) { 
    setInterval(() => {
      this.progress += 1;
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);
  }

  ngOnDestroy() {
    this.csvdata = [];
    if (this.getFarmAnimalsSub) {
      this.getFarmAnimalsSub.unsubscribe();
    }
    if (this.getAllAnimalsSub) {
      this.getAllAnimalsSub.unsubscribe();
    }
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }
    if (this.farmIdSubscription) {
      this.farmIdSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    let userId;
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe((user) => {
      if (user) {
        userId = user["id"];
        this.isLoading = false;
      }
    });

    this.isLoading = true;
    if (!this.fetchUserDataSub) {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(userId)
        .subscribe((data) => {
          if (data) {
            this.isLoading = false;
          }
        });
    }
  }

  ngOnInit() {
    this.isLoading = true;
    if (!this.userDataSub) {
      this.userDataSub = this.userService.userData.subscribe((data) => {
        if (data) {
          this.heatEvents = data["heatEvents"];
          this.healthEvents = data["healthEvents"];
          this.inseminations = data["inseminations"];
          this.pregnancyEvents = data["pregnancy_checks"];
          this.isLoading = false;
        }
      });
    }

    this.isLoading = true;
    if (!this.farmIdSubscription) {
      this.farmIdSubscription = this.userService.farmId$.subscribe((farmId) => {
        if (farmId) {
          this.results =
            farmId === "All Farms"
              ? this.heatEvents
              : this.heatEvents.filter(
                (event) => event?.animal.farm.id === farmId
              );

          this.pregnancyEvents =
            farmId === "All Farms"
              ? this.pregnancyEvents
              : this.pregnancyEvents.filter(
                (event) => event?.animal.farm.id === farmId
              );
          this.isLoading = false;
        }
      });
    }

  }

  filterEvents() {
    const from = new Date(this.fromDate).getTime();
    const to = new Date(this.toDate).getTime();
    this.results = this.heatEvents
      .filter((event) => {
        const startedAtTime = new Date(event?.detectedAt).getTime();
        return startedAtTime >= from && startedAtTime <= to;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
      );

    this.pregnancyEvents = this.pregnancyEvents
      .filter((event) => {
        const startedAtTime = new Date(event?.eventDateTime).getTime();
        return startedAtTime >= from && startedAtTime <= to;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime()
      );
  }

  async handleInput(event: any) {
    this.isLoading = true;
    const value = event.detail.value;
    this.results = this.inputHandlerService.handleInput(value, this.animals);
    this.isLoading = false;
  }

  sortTable(columnIndex: number): void {
    this.sortOrders = this.sortHandlerService.sortTable(
      columnIndex,
      "myTable",
      this.sortOrders
    );
  }

  getAnimalHeatStrength(animalId: string) {
    const filteredElements = this.heatEvents.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.detectedAt || '1970-01-01') > new Date(prev.detectedAt || '1970-01-01')
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalLastInsemination(animalId: string) {
    const filteredElements = this.inseminations.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.eventDateTime || '1970-01-01') > new Date(prev.eventDateTime || '1970-01-01')
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalPregnancyStatus(animalId: string) {
    const filteredElements = this.pregnancyEvents.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.eventDateTime || '1970-01-01') > new Date(prev.eventDateTime || '1970-01-01')
        ? current
        : prev;
    });
    return latestElement;
  }

}
