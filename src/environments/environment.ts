// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCzztbqPLFEIVtkHna2ieMvug8Z2UoZ9CE",
    authDomain: "fir-cloud-message-9a5e8.firebaseapp.com",
    projectId: "fir-cloud-message-9a5e8",
    storageBucket: "fir-cloud-message-9a5e8.appspot.com",
    messagingSenderId: "554709146416",
    appId: "1:554709146416:web:9b2da4e6994e4a2165c6f5",
  },
  flixdrop: {
    // apiUrl: "http://49.205.217.167:9041/graphql"
    apiUrl: "https://chms.flixdrop.com/api/v1"
    // apiUrl: "http://49.205.217.167:9041/api/v1"
    // apiUrl: "http://localhost:9000/api/v1"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
