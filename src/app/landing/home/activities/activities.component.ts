import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { InputHandlerService } from "src/app/services/input-handler/input-handler.service";
import { SortTableService } from "src/app/services/sort-table/sort-table.service";

@Component({
  selector: "app-heats",
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.scss"],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  private fetchUserDataSub: Subscription;
  private userDataSub: Subscription;
  private farmIdSubscription: Subscription;

  results: any[] = [];
  activities: any[] = [];
  sortOrders = {};

  fromDate: string;
  toDate: string;
  maxDate: string;

  // Healthy thresholds for activities
  healthyFeedingTimeMin: number = 240;
  healthyFeedingTimeMax: number = 480;
  healthyRuminatingTimeMin: number = 420;
  healthyRuminatingTimeMax: number = 600;
  healthyStandingTimeMin: number = 180;
  healthyStandingTimeMax: number = 420;
  healthyRestingTimeMin: number = 540;
  healthyRestingTimeMax: number = 720;
  healthySleepingTimeMin: number = 240;
  healthySleepingTimeMax: number = 360;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private inputHandlerService: InputHandlerService,
    private sortHandlerService: SortTableService
  ) {}

  ngOnDestroy() {
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
          // this.activities = data["activities"].filter((event) => {
          //   if (event.type === "Feeding" && +event.value < this.healthyFeedingTimeMin || +event.value > this.healthyFeedingTimeMax) {
          //     return event;
          //   }
          //   if (event.type === "Ruminating" && +event.value < this.healthyRuminatingTimeMin || +event.value > this.healthyRuminatingTimeMax) {
          //     return event;
          //   }
          //   if (event.type === "Standing" && +event.value < this.healthyStandingTimeMin || +event.value > this.healthyStandingTimeMax) {
          //     return event;
          //   }
          //   if (event.type === "Resting" && +event.value < this.healthyRestingTimeMin || +event.value > this.healthyRestingTimeMax) {
          //     return event;
          //   }
          //   if (event.type === "Sleeping" && +event.value < this.healthySleepingTimeMin || +event.value > this.healthySleepingTimeMax) {
          //     return event;
          //   }
          // }) || [];

          this.activities = data["activities"] || [];

          console.log("Acivities in Activities Page :", this.activities);
          this.isLoading = false;
        }
      });
    }

    this.isLoading = true;
    if (!this.farmIdSubscription) {
      this.farmIdSubscription = this.userService.farmId$.subscribe((farmId) => {
        if (farmId) {
          this.activities =
            farmId === "All Farms"
              ? this.activities
              : this.activities.filter(
                  (event) => event?.animal.farm.id === farmId
                );
          this.filterEvents();
          this.isLoading = false;
        }
      });
    }

    this.maxDate = new Date().toISOString().split("T")[0];
    this.toDate = new Date().toISOString();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.fromDate = thirtyDaysAgo.toISOString().split("T")[0];
    this.filterEvents();
  }

  filterEvents() {
    const from = new Date(this.fromDate).getTime();
    const to = new Date(this.toDate).getTime();
    this.results = this.activities
      .filter((event) => {
        const startedAtTime = new Date(event?.timestamp).getTime();
        return startedAtTime >= from && startedAtTime <= to;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  async handleInput(event: any) {
    this.isLoading = true;
    const value = event.detail.value;
    this.results = this.inputHandlerService.handleInput(value, this.activities);
    this.isLoading = false;
  }

  sortTable(columnIndex: number): void {
    this.sortOrders = this.sortHandlerService.sortTable(
      columnIndex,
      "myTable",
      this.sortOrders
    );
  }

}
