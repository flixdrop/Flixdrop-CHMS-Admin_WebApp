import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IonAccordionGroup, IonModal, IonSearchbar } from '@ionic/angular';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  @ViewChild('popover') popover;

  isOpen = false;

  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild("accordianGroup_1") accordianGroup_1: IonAccordionGroup | any;
  @ViewChild("accordianGroup_2") accordianGroup_2: IonAccordionGroup | any;

  fetchUserDataSub: Subscription;
  userDataSub: Subscription;
  getAllAnimalsSub: Subscription;
  getFarmAnimalsSub: Subscription;
  results: any[] = [];
  animals: any[] = [];
  farms = [];
  farm = "All Animals";
  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;
  
  isSearchBarFocused = false;
  language: string = "en";
  typeOfUser: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor( private translateService: TranslateService, private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService, private userService: UserService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use(localStorage.getItem('language') || 'en');
    this.language = localStorage.getItem('language') || 'en';
   }

  ngOnDestroy(): void {
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

  ngOnInit(): void {
    this.isLoading = true;
    this.userDataSub = this.authService.authenticatedUser.subscribe(user => {
        this.typeOfUser = user.role;
        console.log('Role: ', this.typeOfUser);
        this.fetchUserDataSub = this.userService.fetchOrganizationDocuments(user['id']).subscribe(data => {
          this.isLoading = false;
        });
    });
  }

  onSearchBarFocus() {
    this.isSearchBarFocused = true;
  }

  onSelectAccordianItem_1() {
    this.accordianGroup_1.value = '';
  }

  onSelectAccordianItem_2() {
    this.accordianGroup_2.value = '';
  }

  onClickLogout() {
    this.authService.logout();
  }

  changeLanguageTo(event) {
    const language: string = event.detail.value;
    localStorage.setItem('language', language);
    this.language = language;
    console.log('Changed to Language: ', this.language);
    window.location.reload();
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

  handleInput(event: any) {
    this.results = [];
    this.animals = [];
    const query = event.target.value.toLowerCase();

    // this.getAllAnimalsSub = this.userService
    //   .getAllAnimals()
    //   .subscribe((allAnimals) => {
    //     const animalArray = allAnimals.values();
    //     this.animals = [...this.animals, ...animalArray];
    //     this.results = this.animals;
    //   });

    if (query.length == 0) {
      this.animals = [];
      this.results = [];
    }
    else if (!this.animals || this.animals.length === 0) {
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

  onClickAnimal(animalId) {
    this.router.navigate(['/landing', 'navs', 'home', 'animal-details', animalId], { replaceUrl: true, state: { clearHistory: true } },);
    this.isSearchBarFocused = false;
    this.animals = [];
    this.results = [];
    this.searchBar.value = '';
  }

  minimizeSearchBar() {
    this.isSearchBarFocused = false;
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onClickSettings(event: any){
    if(event.detail.value === 'logout'){
      this.onClickLogout();
    }
  }
  
}
