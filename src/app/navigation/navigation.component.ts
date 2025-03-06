import { Router, RouterModule } from "@angular/router";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import {
  ActionSheetButton,
  ActionSheetController,
  IonModal,
  IonSearchbar,
  IonicModule,
} from "@ionic/angular";
import { UserService } from "../services/user/user.service";
import { AuthService } from "../services/auth/auth.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild("searchModal") searchModal: IonModal | any;
  @ViewChild("searchbar", { static: false }) searchbar: IonSearchbar | any;

  fetchUserDataSub: Subscription | undefined;
  userDataSub: Subscription | undefined;
  getAllAnimalsSub: Subscription | undefined;
  getFarmAnimalsSub: Subscription | undefined;
  results: any[] = [];
  animals: any[] = [];
  farms: any[] = [];
  admins: any[] = [];

  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;
  language: string = "en";
  typeOfUser: string | undefined;
  selectedAdmin: string | undefined;
  selectedFarm: string | undefined;

  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(
  //     map((result) => result.matches),
  //     shareReplay()
  //   );

  // isWeb$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Web)
  //   .pipe(
  //     map((result) => result.matches),
  //     shareReplay()
  //   );

  constructor(
    private translateService: TranslateService,
    // private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private actionSheetContoller: ActionSheetController
  ) {
    this.translateService.setDefaultLang("en");
    this.translateService.use(localStorage.getItem("language") || "en");
    this.language = localStorage.getItem("language") || "en";
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userDataSub = this.authService.authenticatedUser.subscribe((user) => {
      if (user) {
        this.typeOfUser = user["role"];
        this.loadOrganizationData(user["id"]);
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }
  }

  private loadOrganizationData(userId: string): void {
    console.log("Navigation Page - loadOrganizationData() called");
    this.fetchUserDataSub = this.userService
      .fetchOrganizationDocuments(userId)
      .subscribe(
        (data) => {
          console.log(
            "Navigation Page - fetchOrganizationDocuments() data:",
            data
          );
          if (data) {
            this.admins = this.extractUniqueAdmins(data.farms);
            console.log("Navigation Page - Admins extracted:", this.admins);

            // Move setInitialSelections() here
            this.handleUserRoles(userId);
            this.loadFarmsForSelectedAdmin();
            console.log("Navigation Page - loadFarmsForSelectedAdmin() called");

            //set the farms array before setInitialSelections is called.
            this.farms = data.farms;
            this.setInitialSelections();
            console.log("Navigation Page - setInitialSelections() called");
          }
          this.isLoading = false;
          console.log("Navigation Page - Data loading complete");
        },
        (error) => {
          console.error("Error loading organization data:", error);
          this.isLoading = false;
        }
      );
  }

  private extractUniqueAdmins(farms: any[]): any[] {
    return Array.from(
      new Map(
        farms.map((farm) => [
          farm.organization.parentOrganization.id,
          farm.organization.parentOrganization,
        ])
      ).values()
    );
  }

  private setInitialSelections(): void {
    const storedAdminId = this.userService.getStoredAdminId();
    console.log("Stored Admin ID:", storedAdminId);
    console.log("Admins Array Length:", this.admins.length);

    if (this.admins.length > 0) {
      const initialAdmin = storedAdminId
        ? this.admins.find((admin) => admin?.user?.id === storedAdminId)
        : this.admins[0];

      if (initialAdmin) {
        console.log("Initial Admin:", initialAdmin);
        this.setAdminSelection(initialAdmin.user.id, initialAdmin.name);
      } else {
        console.log("Initial admin is null or undefined");
      }
    }

    // Restore farm selection
    const storedFarmId = this.userService.getStoredFarmId();
    console.log("Stored Farm ID (Before):", storedFarmId);
    console.log("Farms Array Length:", this.farms.length);

    if (storedFarmId && this.farms.some((farm) => farm.id === storedFarmId)) {
      console.log("Valid Stored Farm ID Found");
      const selectedFarm = this.farms.find((farm) => farm.id === storedFarmId);
      if (selectedFarm) {
        console.log("Selected Farm:", selectedFarm);
        this.selectedFarm = selectedFarm.name;
        this.userService.setFarmId(storedFarmId);
        console.log("Set Farm ID (After):", storedFarmId);
      }
    } else if (this.farms.length > 0) {
      console.log("No Valid Stored Farm ID, Defaulting to First Farm");
      this.selectedFarm = this.farms[0]?.name || "All Farms";
      this.userService.setFarmId(this.farms[0]?.id || "All Farms");
      console.log("Set Farm ID (After):", this.farms[0]?.id || "All Farms");
    } else {
      console.log("Farms Array is Empty, Cannot Set Initial Farm");
    }
  }

  private handleUserRoles(userId: string): void {
    if (this.typeOfUser === "SUPER_ADMIN" && this.admins.length > 0) {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(this.admins[0]?.user?.id)
        .subscribe((superAdminData) => {
          if (superAdminData) {
            this.setFarmSelection("All Farms", "All Farms");
            this.farms = superAdminData.farms;
          }
        });
    } else if (this.typeOfUser === "USER") {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(userId)
        .subscribe((userData) => {
          if (userData) {
            this.setFarmSelection("All Farms", "All Farms");
            this.farms = userData.farms;
          }
        });
    }
  }

  private loadFarmsForSelectedAdmin(): void {
    const adminId = this.userService.getAdminId();
    console.log("loadFarmsForSelectedAdmin() called. Admin ID:", adminId);
    console.log("Fetching farms for selected admin:", adminId);
    console.log("Admin ID Condition Met:", adminId && adminId !== "All Admins");

    if (adminId && adminId !== "All Admins") {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(adminId)
        .subscribe(
          (data) => {
            console.log("Farms data received:", data);
            if (data) {
              this.farms = data.farms;
              console.log("Farms updated:", this.farms);
              this.userService.setFarmId("All Farms");
              console.log("Farm ID reset to All Farms");
            }
          },
          (error) => {
            console.error("Error loading farms for selected admin:", error);
          }
        );
    } else {
      // If adminId is 'All Admins', load all farms from initial data.
      const initialUserData = this.userService.userData.getValue();
      if (initialUserData && initialUserData.farms) {
        this.farms = initialUserData.farms;
        console.log("Farms set to initial user data");
      }
    }
  }

  private setFarmSelection(farmId: string, farmName: string): void {
    this.selectedFarm = farmName;
    this.userService.setFarmId(farmId);
  }

  private setAdminSelection(adminId: string, adminName: string): void {
    this.selectedAdmin = adminName;
    this.userService.setAdminId(adminId);
  }

  async onClickLogout() {
    await this.authService.logout();
  }

  handleInput(event: any) {
    this.results = [];
    this.animals = [];
    const query = event.target.value.toLowerCase();

    this.getAllAnimalsSub = this.userService.userData.subscribe((data) => {
      const animalArray = data.animals;
      this.animals = [...this.animals, ...animalArray];
      this.results = this.animals;
    });

    if (query.length == 0) {
      this.animals = [];
      this.results = [];
    } else if (!this.animals || this.animals.length === 0) {
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

  onClickAnimal(animalId: any) {
    this.router
      .navigate(["/farm", "dashboard", "charts", animalId], {
        replaceUrl: true,
        state: { clearHistory: true },
      })
      .then(() => {
        this.closeSearchModal();
      });
  }

  closeSearchModal() {
    this.searchModal.dismiss().then();
    if (this.searchbar) {
      this.searchbar.value = null;
      this.animals = null;
      this.results = null;
    }
  }

  onBlurSearchBar() {
    console.log("Modal Dismissed");
    if (this.searchbar) {
      this.searchbar.value = null;
      this.animals = null;
      this.results = null;
    }
  }

  async onClickLanguage() {
    const alert = await this.actionSheetContoller.create({
      header: "Select Language",
      buttons: [
        {
          text: "English",
          data: { language: "en" },
          handler: () => {
            const data = (alert.buttons[0] as ActionSheetButton).data.language;
            localStorage.setItem("language", data);
            this.language = data;
            console.log("Changed to Language: ", this.language);
            window.location.reload();
          },
        },
        {
          text: "हिंदी",
          data: { language: "hi" },
          handler: () => {
            const data = (alert.buttons[1] as ActionSheetButton).data.language;
            localStorage.setItem("language", data);
            this.language = data;
            console.log("Changed to Language: ", this.language);
            window.location.reload();
          },
        },
        {
          text: "ಕನ್ನಡ",
          data: { language: "ka" },
          handler: () => {
            const data = (alert.buttons[2] as ActionSheetButton).data.language;
            localStorage.setItem("language", data);
            this.language = data;
            console.log("Changed to Language: ", this.language);
            window.location.reload();
          },
        },
      ],
    });

    await alert.present();
  }

  onSelectFarm(event: CustomEvent): void {
    this.isLoading = true;
    const selectedFarm = event.detail.value;

    if (selectedFarm === "All Farms") {
      this.selectedFarm = "All Farms";
      this.userService.setFarmId("All Farms");
      console.log("Farm Selected: All Farms");
    } else {
      const { id: farmId, name: farmName } = selectedFarm;
      this.selectedFarm = farmName;
      this.userService.setFarmId(farmId);
      console.log("Farm Selected:", farmName);
    }

    this.isLoading = false;
  }

  // Add logs to the onSelectAdmin function.
  onSelectAdmin(event: CustomEvent): void {
    this.isLoading = true;
    const selectedAdmin = event.detail.value;
    const adminId = selectedAdmin.user.id;
    console.log("onSelectAdmin called. New Admin ID: ", adminId);

    this.setAdminSelection(adminId, selectedAdmin.name);

    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }

    this.fetchUserDataSub = this.userService
      .fetchOrganizationDocuments(adminId)
      .subscribe(
        (data) => {
          if (data) {
            this.farms = data.farms;
            this.userService.setFarmId("All Farms"); // Reset farmId to "All Farms"
            this.selectedFarm = "All Farms"; //reset farm selection
            console.log("All Farms :", data.farms);
            console.log("onSelectAdmin - Farm ID reset to All Farms");
          }
          this.isLoading = false;
        },
        (error) => {
          console.error("Error fetching organization documents:", error);
          this.isLoading = false;
        }
      );
  }
}
