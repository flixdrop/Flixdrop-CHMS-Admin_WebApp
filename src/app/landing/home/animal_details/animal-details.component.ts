import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-animal-details",
  templateUrl: "./animal-details.component.html",
  styleUrls: ["./animal-details.component.scss"],
})
export class AnimalDetailsComponent implements OnInit, OnDestroy {
  fetchUserDataSub: Subscription;
  userDataSub: Subscription;
  getAllAnimalsSub: Subscription;
  getFarmAnimalsSub: Subscription;
  results: any[] = [];
  animals: any[] = [];
  farms = [];
  selectedFarm: string = "All Animals";
  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;

  heatEvents: any[] = [];
  healthEvents: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnDestroy() {
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
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe((user) => {
      this.userService
        .fetchOrganizationDocuments(user["id"])
        .subscribe((data: any) => {
          if(data){
            this.isLoading = false;
          }
        });
    });
  }

  ngOnInit() {
    this.userDataSub = this.userService.userData.subscribe((data) => {
      if (data) {
        this.farms = data.farms;
        this.animals = data.animals;
        this.heatEvents = data.heatEvents;
        this.healthEvents = data.healthEvents;
        this.results = this.animals;
      }
    });
  }

  toggleSearch() {
    this.searchToggle = !this.searchToggle;
  }

  timeStampTODate(timeStamp) {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const date = new Date(timeStamp).getDate();
    const month = monthNames[new Date(timeStamp).getMonth()];
    const year = new Date(timeStamp).getFullYear().toString().slice(-2);
    return `${date} ${month} ${year}`;
  }

  onSelectFarm(event: any) {

    const farm = event.target.value;
    const farmId = farm.id;

    if (event.target.value == "All Animals") {
      this.selectedFarm = "All Animals";

      this.userDataSub = this.userService.userData.subscribe((data) => {
        if (data) {
          this.results = this.animals;
        }
      });
    } else if (farm) {
      this.selectedFarm = farm.name;
      this.userDataSub = this.userService.userData.subscribe((data) => {
        if (data) {
          this.results = this.animals.filter(
            (animal) => animal.farm.id == farmId
          );
        }
      });
    }
  }

  handleInput(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
    const query = event.target.value.toLowerCase();

    if (!this.animals || this.animals.length === 0) {
      this.results = [];
      return;
    }
    this.results = this.animals.filter((item) => {
      return Object.values(item).some((value: any) => {
        if (value && typeof value === "string") {
          return value.toLowerCase().includes(query);
        } else if (value && typeof value === "object") {
          return Object.values(value).some((nestedValue: any) => {
            if (nestedValue && typeof nestedValue === "string") {
              return nestedValue.toLowerCase().includes(query);
            }
            return false;
          });
        }
        return false;
      });
    });
  }

  sortTable(columnIndex: number) {
    document.querySelectorAll("th.sort-asc, th.sort-desc").forEach((th) => {
      th.classList.remove("sort-asc", "sort-desc");
    });
    const table = document.getElementById("myTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    // Get the current sorting order for the column or initialize it to 'asc'
    let sortOrder = this.sortOrders[columnIndex] || "asc";

    rows.sort((a, b) => {
      const cellA = a.cells[columnIndex].textContent.trim();
      const cellB = b.cells[columnIndex].textContent.trim();

      // Check if the column is numeric
      const isNumeric = !isNaN(+cellA) && !isNaN(+cellB);
      let comparison;

      if (isNumeric) {
        const numberA = parseFloat(cellA);
        const numberB = parseFloat(cellB);
        comparison = numberA - numberB;
      } else {
        comparison = cellA.localeCompare(cellB, undefined, { numeric: true });
      }

      // Apply sorting order based on current sortOrder
      if (sortOrder === "desc") {
        return comparison * -1; // Reverse the sorting order
      }

      return comparison;
    });

    // Toggle the sorting order for the column
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.sortOrders[columnIndex] = sortOrder;

    // Clear the existing table rows
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Append sorted rows back to the table
    rows.forEach((row) => tbody.appendChild(row));
  }

  getAnimalHealthIndex(animalId: string) {
    const filteredElements = this.healthEvents.filter(
      (element) => element.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.detectedAt) > new Date(prev.detectedAt)
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalHeatStrength(animalId: string) {
    const filteredElements = this.heatEvents.filter(
      (element) => element.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.detectedAt) > new Date(prev.detectedAt)
        ? current
        : prev;
    });
    return latestElement;
  }
}
