import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class InputHandlerService {

  results: any[] = [];

  constructor() {}

  handleInput(input: any, items: any[]): any[] {
    // const query = input.toLowerCase();

    // if (!animals || animals.length === 0) {
    //   return [];
    // }
    // return animals.filter((item) => {
    //   return Object.values(item).some((value: any) => {
    //     if (value && typeof value === "string") {
    //       return value.toLowerCase().includes(query);
    //     } else if (value && typeof value === "object") {
    //       return Object.values(value).some((nestedValue: any) => {
    //         if (nestedValue && typeof nestedValue === "string") {
    //           return nestedValue.toLowerCase().includes(query);
    //         }
    //         return false;
    //       });
    //     }
    //     return false;
    //   });
    // });

  
    // If healthEvents is undefined, null, or empty, return an empty array
    if (!items || items.length === 0) {
      this.results = [];
      return [];
    }

    const query = input.toLowerCase();

    return items.filter((item) => {
      return Object.values(item || {}).some((value: any) => {
        // Check if value exists and is a string, then match the query
        if (value && typeof value === "string") {
          return value.toLowerCase().includes(query);
        }
        // Check if value is an object, then search within its values
        else if (value && typeof value === "object") {
          return Object.values(value || {}).some((nestedValue: any) => {
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
}
