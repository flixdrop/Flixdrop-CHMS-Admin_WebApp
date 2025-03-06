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

  ngOnInit() {
    console.log('Health Page ngOnInit'); // Log the data
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
