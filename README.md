# J1C Awards

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

 j1_Charts, M-gH2Ys-QkmKGAjyyAys

 ##Angular environmental variable strategy that can be used so that you don't have rebuild an app just to change a few variables.
 /environments/environment.###.ts files can be useful for various builds, but using environmental variables allows you to change
 data on the fly in place.    https://www.jvandemo.com/how-to-use-environment-variables-to-configure-your-angular-application-without-a-rebuild/

 ## Pathological cases:

 Organization 'Other' with no sub-org selected
	Award identified as complete:
		-not used in matrix
		-not used in in-progress
		-used in charts based on criteria

	Award identified as in-progress
		-not used in matrix
		-used in in-progress
		-not used in charts

Award type 'Other' with no award sub-type
	Award identified as complete:
		-not used in matrix
		-not used in in-progress
		-used in charts based on criteria


	Award identified as in-progress
		-not used in matrix
		-used in in-progress
		-not used in chart based criteria

Award type 'Other' and award is identified as sub-type not to use in matrix
		
Award identified as complete:
		-not used in matrix
		-not used in in-progress
		-used in charts based on criteria


	Award identified as in-progress
		-not used in matrix
		-used in in-progress
		-not used in chart based criteria


5/14 - can we remove doUseInMatrix() out of enclosing function?  It has been moved out already to allow matrix awards to be processed.
8/28 - fiscal-year branch contains commented out code that was supposed to be used to allow an awards matrix to be displayed with fiscal year dates vice physical year.
