import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription, map, take } from "rxjs";

@Component({
  selector: "app-heat-details",
  templateUrl: "./heat-details.component.html",
  styleUrls: ["./heat-details.component.scss"],
})
export class HeatDetailsComponent implements OnInit, OnDestroy {
  fetchUserDataSub: Subscription;
  userDataSub: Subscription;
  userRole: string = "";
  results: any[] = [];
  heatEvents = [];
  farms : any[] = [];
  selectedFarm = "All Animals";
  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

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
    this.authService.authenticatedUser.subscribe((user) => {
      this.userService
        .fetchOrganizationDocuments(user["id"])
        .subscribe((data) => {
          this.isLoading = false;
        });
    });
  }

  ngOnInit() {
    this.userDataSub = this.userService.userData
      .pipe(
        take(1),
        map((data) => {
          const currentTime = new Date().getTime();
          this.farms = data["farms"];
          this.heatEvents = data["heatEvents"].filter((item) => {
            const startedAtTime = new Date(item.startedAt).getTime();
            return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
          });
          this.results = this.heatEvents;
        })
      )
      .subscribe();
  }

  toggleSearch() {
    this.searchToggle = !this.searchToggle;
  }

  onSelectFarm(event) {
    const farm = event.target.value;
    const farmId = farm.id;

    if (event.target.value == "All Animals") {
      this.userDataSub = this.userService.userData
        .pipe(
          take(1),
          map((data) => {
            this.selectedFarm = "All Animals";
            this.results = this.heatEvents;
          })
        )
        .subscribe();
    } else if (farm) {
      this.userDataSub = this.userService.userData
        .pipe(
          take(1),
          map((data) => {
            this.selectedFarm = farm.name;
            this.results = this.heatEvents.filter(
              (heatEvent) => heatEvent.animal.farm.id === farmId
            );
          })
        )
        .subscribe();
    }
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

  // timeStampTOTime(timeStamp) {
  //   const dateObj = new Date(timeStamp);
  //   let hours = dateObj.getHours();
  //   const minutes = dateObj.getMinutes();
  //   const seconds = dateObj.getSeconds();
  //   const meridiem = hours >= 12 ? "PM" : "AM";

  //   // Convert hours to 12-hour format
  //   hours = hours % 12 || 12;

  //   return `${hours}:${minutes} ${meridiem}`;
  // }

  timeStampTOTime(timeStamp) {
    const dateObj: any = new Date(timeStamp);
    let hours: any = dateObj.getHours();
    let minutes: any = dateObj.getMinutes();
    const seconds: any = dateObj.getSeconds();
    const meridiem: any = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to hours if less than 10
    hours = hours < 10 ? "0" + hours : hours;

    // Add leading zero to minutes if less than 10
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${meridiem}`;
  }

  onClickNotify(heatAlert) {
    console.log("heatAlert- ", heatAlert);
  }

  handleInput(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
    const query = event.target.value.toLowerCase();

    if (!this.heatEvents || this.heatEvents.length === 0) {
      this.results = [];
      return;
    }

    this.results = this.heatEvents.filter((item) => {
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
}
