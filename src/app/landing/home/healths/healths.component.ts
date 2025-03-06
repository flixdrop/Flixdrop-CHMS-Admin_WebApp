import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user/user.service";
import { combineLatest, Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { InputHandlerService } from "src/app/services/input-handler/input-handler.service";
import { SortTableService } from "src/app/services/sort-table/sort-table.service";

@Component({
  selector: "app-healths",
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  templateUrl: "./healths.component.html",
  styleUrls: ["./healths.component.scss"],
})
export class HealthsComponent implements OnInit, OnDestroy {

  // private fetchUserDataSub: Subscription | undefined;
  private userDataSub: Subscription | undefined;
  private farmIdSubscription: Subscription | undefined;
  private subscriptions: Subscription = new Subscription(); // Use a single Subscription

  results: any[] = [];
  healthEvents: any[] = [];
  sortOrders = {};

  fromDate: string;
  toDate: string;
  maxDate: string;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private inputHandlerService: InputHandlerService,
    private sortHandlerService: SortTableService
  ) {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.toDate = new Date().toISOString();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.fromDate = thirtyDaysAgo.toISOString().split('T')[0];
  }

  // ngOnDestroy() {
  //   if (this.userDataSub) {
  //     this.userDataSub.unsubscribe();
  //   }
  //   if (this.fetchUserDataSub) {
  //     this.fetchUserDataSub.unsubscribe();
  //   }
  //   if (this.farmIdSubscription) {
  //     this.farmIdSubscription.unsubscribe();
  //   }
  // }

  // ionViewWillEnter() {
  //   let userId;
  //   this.isLoading = true;
  //   this.authService.authenticatedUser.subscribe((user) => {
  //     if (user) {
  //       userId = user["id"];
  //       this.isLoading = false;
  //     }
  //   });

  //   this.isLoading = true;
  //   if (!this.fetchUserDataSub) {
  //     this.fetchUserDataSub = this.userService
  //       .fetchOrganizationDocuments(userId)
  //       .subscribe((data) => {
  //         if (data) {
  //           this.isLoading = false;
  //         }
  //       });
  //   }
  // }

  // ngOnInit() {
  //   this.isLoading = true;
  //   if (!this.userDataSub) {
  //     this.userDataSub = this.userService.userData.subscribe((data) => {
  //       if (data) {
  //         this.healthEvents = data["healthEvents"];
  //         this.isLoading = false;
  //       }
  //     });
  //   }

  //   this.isLoading = true;
  //   if (!this.farmIdSubscription) {
  //     this.farmIdSubscription = this.userService.farmId$.subscribe((farmId) => {
  //       if (farmId) {
  //         console.log("Farm Id at Health Page :", farmId);

  //         // Store farmId in local storage
  //         localStorage.setItem('farmId', farmId);

  //         this.healthEvents =
  //           farmId === "All Farms"
  //             ? this.healthEvents
  //             : this.healthEvents.filter(
  //               (event) => event?.animal.farm.id === farmId
  //             );
  //         this.filterEvents();
  //         this.isLoading = false;
  //       }
  //     });
  //   }

  //   // Load farmId from local storage on component initialization
  //   const storedFarmId = localStorage.getItem('farmId');
  //   if (storedFarmId) {
  //     this.userService.setFarmId(storedFarmId); // Set the farmId in your service
  //   }

  //   this.maxDate = new Date().toISOString().split("T")[0];
  //   this.toDate = new Date().toISOString();
  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  //   this.fromDate = thirtyDaysAgo.toISOString().split("T")[0];
  //   this.filterEvents();
  // }

  // filterEvents() {
  //   const from = new Date(this.fromDate).getTime();
  //   const to = new Date(this.toDate).getTime();
  //   this.results = this.healthEvents
  //     .filter((event) => {
  //       const startedAtTime = new Date(event?.detectedAt).getTime();
  //       return startedAtTime >= from && startedAtTime <= to;
  //     })
  //     .sort(
  //       (a: any, b: any) =>
  //         new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  //     );
  // }


  // ngOnInit() {
  //   this.loadData();
  //   this.subscribeToFarmId();
  // }

  // ngOnDestroy() {
  //   if (this.farmIdSubscription) {
  //     this.farmIdSubscription.unsubscribe();
  //   }
  //   if (this.userDataSub){
  //     this.userDataSub.unsubscribe();
  //   }
  // }

  // loadData() {
  //   this.isLoading = true;
  //   this.userDataSub = this.userService.userData.subscribe((data) => {
  //     if (data && data["healthEvents"]) {
  //       this.healthEvents = data["healthEvents"];
  //       this.filterEvents();
  //     }
  //     this.isLoading = false;
  //   });
  // }

  // subscribeToFarmId() {
  //   this.farmIdSubscription = this.userService.farmId$.subscribe((farmId) => {
  //     if (farmId) {
  //       console.log('Farm Id at Health Page :', farmId);
  //       this.filterEvents();
  //     }
  //   });
  // }

  // filterEvents() {
  //   const farmId = this.userService.getFarmId();
  //   if (farmId && farmId !== 'All Farms') {
  //     this.healthEvents = this.healthEvents.filter(
  //       (event) => event?.animal?.farm?.id === farmId
  //     );
  //   }
  // }





  ngOnInit() {
    console.log('Health Page ngOnInit'); // Log the data
    // this.loadData();
    this.subscribeToData();
    this.subscribeToFarmId();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Unsubscribe all subscriptions
    if (this.farmIdSubscription) {
      this.farmIdSubscription.unsubscribe();
    }
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
  }

  // loadData() {
  //   this.isLoading = true;
  //   this.userDataSub = this.userService.userData.subscribe(
  //     (data) => {

  //       if (data && data['healthEvents']) {
  //         console.log('Health Page - data.healthEvents:', data.healthEvents); // log data.healthEvents

  //         this.healthEvents = data['healthEvents'];
  //         this.results = this.healthEvents;
  //         console.log('Events: ', this.healthEvents );

  //         this.filterEvents();
  //       }
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error loading user data:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  subscribeToFarmId() {
    this.farmIdSubscription = this.userService.farmId$.subscribe(
      (farmId) => {
        console.log('Farm Id at Health Page:', farmId);
        this.filterEvents();
      },
      (error) => {
        console.error('Error subscribing to farmId:', error);
      }
    );
  }

  // filterEvents() {
  //   const farmId = this.userService.getFarmId();
  //   const from = new Date(this.fromDate).getTime();
  //   const to = new Date(this.toDate).getTime();

  //   if (farmId && farmId !== 'All Farms' && this.healthEvents) { // Check if healthEvents exists
  //   this.results = this.healthEvents
  //     .filter((event) => {
  //        const startedAtTime = new Date(event?.detectedAt).getTime();
  //        return event?.animal?.farm?.id === farmId && startedAtTime >= from && startedAtTime <= to;
  //     })
  //     .sort(
  //       (a: any, b: any) =>
  //         new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  //     );
  //   } else if (farmId === 'All Farms' && this.healthEvents === undefined){
  //     console.log('Health Page at Filter Events'); // Log the data
  //     this.loadData();
  // }
  // }


  subscribeToData() {
    this.isLoading = true;
    this.subscriptions.add(
      combineLatest([this.userService.adminId$, this.userService.farmId$]).subscribe(
        ([adminId, farmId]) => {
          console.log('Health Page - Admin Id:', adminId, 'Farm Id:', farmId);
          this.loadData(adminId);
        },
        (error) => {
          console.error('Error in combineLatest:', error);
          this.isLoading = false;
        }
      )
    );
  }

  loadData(adminId: string) {
    this.subscriptions.add(
      this.userService.fetchOrganizationDocuments(adminId).subscribe(
        (data) => {
          this.healthEvents = data["healthEvents"];
          this.filterEvents();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading health data:', error);
          this.isLoading = false;
        }
      )
    );
  }

  // filterEvents() {
  //   const farmId = this.userService.getFarmId();
  //   const from = new Date(this.fromDate).getTime();
  //   const to = new Date(this.toDate).getTime();

  //   if (farmId && farmId !== 'All Farms' && this.results) { // Check if healthEvents exists
  //   this.results = this.results
  //     .filter((event) => {
  //        const startedAtTime = new Date(event?.detectedAt).getTime();
  //        return event?.animal?.farm?.id === farmId && startedAtTime >= from && startedAtTime <= to;
  //     })
  //     .sort(
  //       (a: any, b: any) =>
  //         new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  //     );
  //   } else if (farmId === 'All Farms' && this.results === undefined){
  //     console.log('Health Page at Filter Events'); // Log the data
  //     this.subscribeToData();
  // }
  // }


  filterEvents() {
    const farmId = this.userService.getFarmId();
    const from = new Date(this.fromDate).getTime();
    const to = new Date(this.toDate).getTime();
  
    if (farmId && farmId !== 'All Farms' && this.healthEvents) {
      this.results = this.healthEvents
        .filter((event) => {
          const startedAtTime = new Date(event?.detectedAt).getTime();
          return event?.animal?.farm?.id === farmId && startedAtTime >= from && startedAtTime <= to;
        })
        .sort((a: any, b: any) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
    } else if (farmId === 'All Farms' && this.healthEvents) {
      this.results = this.healthEvents
        .filter((event) => {
          const startedAtTime = new Date(event?.detectedAt).getTime();
          return startedAtTime >= from && startedAtTime <= to;
        })
        .sort((a: any, b: any) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
    }
  }

  // filterEvents() {
  //   const farmId = this.userService.getFarmId();
  //   if (farmId && farmId !== 'All Farms' && this.healthEvents) {
  //     this.results = this.healthEvents.filter(
  //       (event) => event?.animal?.farm?.id === farmId
  //     );
  //   } else if (farmId === 'All Farms' && this.healthEvents === undefined) {
  //     this.subscribeToData();
  //   }
  // }

  // async handleInput(event: any) {
  //   this.isLoading = true;
  //   const value = event.detail.value;
  //   console.log("Value: ", value);
  //   if (value) {
  //     this.results = this.inputHandlerService.handleInput(
  //       value,
  //       this.healthEvents
  //     );
  //   } else if (value === "") {
  //     console.log("Else block executed");
  //   }
  //   this.isLoading = false;
  // }

  async handleInput(event: any) {
    this.isLoading = true;
    const value = event.detail.value;
    console.log('Value: ', value);
    if (value) {
      this.results = this.inputHandlerService.handleInput(value, this.healthEvents);
    } else {
      this.results = [...this.healthEvents]; // Reset results to all events
    }
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
