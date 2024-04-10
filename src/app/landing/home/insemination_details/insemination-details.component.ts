import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription, map, take } from "rxjs";

@Component({
  selector: "app-insemination-details",
  templateUrl: "./insemination-details.component.html",
  styleUrls: ["./insemination-details.component.scss"],
})
export class InseminationDetailsComponent implements OnInit, OnDestroy {
  fetchUserDataSub: Subscription;
  userDataSub: Subscription;
  results: any[] = [];
  inseminations = [];
  farms = [];
  farm = "All Animals";
  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnDestroy() {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe(user =>{
      this.userService.fetchOrganizationDocuments(user['id']).subscribe(data => {
        this.isLoading = false;
      });
    });
  }

  ngOnInit(): void {
    this.results = [];
    this.inseminations = [];
    this.farms = [];

    this.userDataSub = this.userService.userData
      .pipe(
        take(1),
        map((userData) => {
          const inseminations = userData["inseminations"];
          const farms = userData["section_location_id"];
          this.inseminations = inseminations;
          this.farms = [...this.farms, ...farms];
          this.results = this.inseminations;
        })
      )
      .subscribe();
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
    const year = new Date(timeStamp).getFullYear();

    return `${date} ${month} ${year}`;
  }

  onSelectFarm(event) {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe(user =>{
      this.userService.fetchOrganizationDocuments(user['id']).subscribe(data => {
        this.isLoading = false;
      });
    });
    this.results = [];
    this.inseminations = [];
    this.farms = [];
    const farm = event.target.value;
    const farmId = farm["section_location_id"];

    if (event.target.value == "All Animals") {
      this.userDataSub = this.userService.userData
        .pipe(
          take(1),
          map((userData) => {
            this.farm = "All Animals";
            const inseminations = userData["inseminations"];
            const farms = userData["section_location_id"];
            this.inseminations = inseminations;
            this.farms = [...this.farms, ...farms];
            this.results = this.inseminations;
          })
        )
        .subscribe();
    } else {
      this.userDataSub = this.userService.userData
        .pipe(
          take(1),
          map((userData) => {
            this.farm = farm["location_name"];
            const inseminations = userData["inseminations"];
            const farms = userData["section_location_id"];
            this.farms = [...this.farms, ...farms];
            const selectedFarminseminations = this.farms.map((resData) => {
              if (resData["section_location_id"] == farmId) {
                this.inseminations = resData["inseminations"];
              }
            });
            this.results = this.inseminations;
          })
        )
        .subscribe();
    }
  }

  handleInput(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
    const query = event.target.value.toLowerCase();

    if (!this.inseminations || this.inseminations.length === 0) {
      this.results = [];
      return;
    }

    this.results = this.inseminations.filter((item) => {
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

  onClickNotify(inseminations) {
    console.log("inseminations- ", inseminations);
  }
}
