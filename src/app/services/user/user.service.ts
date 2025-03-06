import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  map,
  tap,
  Observable,
  BehaviorSubject,
  catchError,
  throwError,
} from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _userData: any = new BehaviorSubject<any>([]);

  get userData() {
    return this._userData.asObservable();
  }

  
  private adminIdSubject = new BehaviorSubject<string>(this.getStoredAdminId() || 'All Admins');
  adminId$ = this.adminIdSubject.asObservable();
  
  private farmIdSubject = new BehaviorSubject<string>(this.getStoredFarmId() || 'All Farms');
  farmId$ = this.farmIdSubject.asObservable();
  
  constructor(private http: HttpClient) { }


  setAdminId(adminId: string) {
    this.adminIdSubject.next(adminId);
    localStorage.setItem('adminId', adminId);
  }

  getAdminId() {
    return this.adminIdSubject.getValue();
  }

  getFarmId() {
    return this.farmIdSubject.getValue();
  }

  public getStoredAdminId(): string | null {
    return localStorage.getItem('adminId');
  }

setFarmId(farmId: string) {
  console.log('UserService - Setting Farm Id:', farmId);
  this.farmIdSubject.next(farmId);
  localStorage.setItem('farmId', farmId);
}

getStoredFarmId(): string | null {
  const storedFarmId = localStorage.getItem('farmId');
  console.log('UserService - Getting Stored Farm Id:', storedFarmId);
  return storedFarmId;
}

  fetchOrganizationDocuments(userId: string): Observable<any> {
    const requestBody = {
      query: `
      query{
        fetchOrganizationDocuments(userId: "${userId}"){
        farms{
          id
          name
          organization {
            id
            type
             user{
              id
              username
              }
          parentOrganization {
              id
              type
              name
              user{
              id
              username
              }
            }
          }
        }
        animals{
          id
          name 
          collar{
            id
            collarId
            name
          }     
          farm{
            id
            name

            organization{
            type
              user{
                username
                phoneNumber
              }
              parentOrganization{
                name
              }
            }
          }
          createdAt
          updatedAt      
        }
    
        collars{
          id
          collarId
          name
          animal{
            id
            name
            collar{
              collarId
              name
            }
            farm{
              id
              name
            }
          }
        }
       
        heatEvents{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          heatStrength
          startedAt
          endedAt
          detectedAt
          isActive
          createdAt
          updatedAt
        }
        
        healthEvents{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          healthIndex
          startedAt
          endedAt
          detectedAt
          isActive
          createdAt
          updatedAt
        }
        
        inseminations{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }

            process
            semen_breed
            semen_company
            semen_type
            note

          inseminator {
            id
            name
            password
            phoneNumber
            role
            username
          }

          eventDateTime
          isActive
        }
        
        pregnancy_checks{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          result
          eventDateTime
          isActive
        }
 
        drying_offs{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          eventDateTime
          isActive
        }

        calvedEvents{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          eventDateTime
          isActive
        }
       
        milking{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          totalMilk
          createdAt
        }

         activities{
          id
          animal{
            id
            name
            collar{
              collarId
              name
            }
              farm{
                id
                name
                organization{
                  user{
                    username
                    phoneNumber
                  }
                  parentOrganization{
                    name
                  }
                }
              }
            }
          value
          type
          timestamp
        }
      }
    }
      `,
    };

    return this.http
      .post(environment.flixdrop.apiUrl, JSON.stringify(requestBody))
      .pipe(
        map((resData) => {
          if (
            resData &&
            resData["data"] &&
            resData["data"]["fetchOrganizationDocuments"]
          ) {

            console.log('userId: ', userId);
            console.log('Fetch Call: ', resData['data']['fetchOrganizationDocuments']);

            return resData["data"]["fetchOrganizationDocuments"];
          } else {
            return [];
          }
        }),
        tap((userData) => {
          this._userData.next(userData || []);
        }),
        catchError((error) => {
          console.error("Error fetching organization documents:", error);
          this._userData.next([]);
          return throwError(() => new Error(error));
        })
      );
  }

  getGraphData(animalNo: string): Observable<any> {
    return this.http
      .get(`https://chms-firebase-default-rtdb.firebaseio.com/${animalNo}.json`)
      .pipe(
        map((data: any) => {
          if (data) {
            const resultArray = [];
            for (let key in data) {
              if (data.hasOwnProperty(key)) {
                resultArray.push(data[key]);
              }
            }
            return resultArray;
          }
          return null;
        })
      );
  }

  registerAnimal(data: any) {
    const requestBody1 = {
      query: `
      mutation{
        createAnimal(name:"${data.animalName}", farmId:"${data.farmId}"){
          id    
        }
      }
      `,
    };

    const postRequest1 = this.http.post<any>(
      environment.flixdrop.apiUrl,
      JSON.stringify(requestBody1)
    );

    return postRequest1;
  }

  registerCollar(data: any) {
    const requestBody1 = {
      query: `
      mutation{
        createCollar(collarInput:{collarId:"${data.collarNo}", name:"${data.collarNo}", manufacturer:"Flixdrop Technology", type:"IOT Device"}){
          id
        }
      }
      `,
    };

    const postRequest1 = this.http.post<any>(
      environment.flixdrop.apiUrl,
      JSON.stringify(requestBody1)
    );

    return postRequest1;
  }

  tieCollarToAnimal(data: any) {
    const requestBody1 = {
      query: `
      mutation{
        tieCollarToAnimal(collarId:"${data.collarId}", animalId:"${data.animalId}"){
          id
        }
      }
      `,
    };

    const postRequest1 = this.http.post<any>(
      environment.flixdrop.apiUrl,
      JSON.stringify(requestBody1)
    );

    return postRequest1;
  }

  chat(input: string) {
    const requestBody1 = {
      query: `
      mutation{
        chat(input:"${input}")
      }
      `,
    };

    const postRequest1 = this.http.post<any>(
      environment.flixdrop.apiUrl,
      JSON.stringify(requestBody1)
    );

    return postRequest1;
  }
}
