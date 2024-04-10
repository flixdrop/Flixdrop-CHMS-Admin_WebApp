import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap, Observable, BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _userData: any = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {}

  get userData() {
    return this._userData.asObservable();
  }

  fetchOrganizationDocuments(userId: string): Observable<any> {
    const requestBody = {
      query: `
      query{
        fetchOrganizationDocuments(userId: "${userId}"){
        farms{
          id
          name     
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
            name
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

      }
    }

      `,
    };

    return this.http
      .post(environment.flixdrop.apiUrl, JSON.stringify(requestBody))
      .pipe(
        map((resData) => {
          const userData = resData["data"]["fetchOrganizationDocuments"];
          return userData;
        }),
        tap((resData) => {
          const userData = resData;
          this._userData.next(userData);
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
}
