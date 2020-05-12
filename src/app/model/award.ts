

import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { TimeService } from "../services/time.service";

export class Award {

  

    private _awardNumber: string;
    private _awardType: string;
    private _awardSubType: string;

    //Used to track rollup to the 'left' of the matrix.  This has a value if set if _useInMatrix is 'false'
    private _awardState: string;

    private _organization: string;
    private _subordinateUnit: string;


    private _awardStatus: string;
    private _dateAccepted: string;
    private _dateAwardComplete: string;

    private _dateCompleteQC: string;
    private _dateSentToQC: string;


    private _dateStartBoarding: string;
    private _dateCompleteBoarding: string;
    private _bm1VoteDate: string;
    private _bm2VoteDate: string;
    private _bm3VoteDate: string;
    private _bm4VoteDate: string;

    private _dateToHRC: string;
    private _dateToSOCOM: string;

    private _dateMailed: string;

    //True if the award was completed in current year and completed date is not null
    private _useInMatrix: boolean;

    //True if the award should be used in the In Progress awards
    private _useInInprogress: boolean;

    //True if award has been completed in the past 12 months (default) and has a valid DateAccepted amd DateComplete.  These two items 
    //are required to calculate a 'days taken to process' metric
    private _useInChartComplete: boolean;

    //True if the award is complete in the past 12 months (default) and has a valid DateSentToBoarding, DateCompleteBoarding, and DateComplete timestamp
    private _useInBoardingTimeChart: boolean;

    //True if this award has a completion time in the past 12 months (defualt) and has a valid DateSentToQC and DateCompleteQC timestamp
    private _useInQCTimeChart: boolean;

    //True if the the award has a 'Date Mailed' timestamp entry within the past ??7 day or week?? 
    private _mailedThisWeek: boolean;
    

   // constructor(rawAward: any) {
    constructor(rawAward: any, timeService: TimeService) {
        
        console.log("Award: award constructor received", rawAward);

        let currentYear = moment().format("YYYY");

        this._awardNumber = rawAward.Award_x0020_Number || null;
        this._awardType = rawAward.Award_x0020_Type || null;
        this._awardSubType = rawAward.Award_x0020_Subtype || null;
        this._organization = rawAward.SOCAF_x0020_Organization || null;
        this._subordinateUnit = rawAward.SOCAF_x0020_Subordinate_x0020_Un || null;
        this._awardStatus = rawAward.SAPS_x0020_Status || null;
      
        this._bm1VoteDate = rawAward.BoardMember1VoteTime || null;
        this._bm2VoteDate = rawAward.BoardMember2VoteTime || null;
        this._bm3VoteDate = rawAward.BoardMember3VoteTime || null;
        this._bm4VoteDate = rawAward.BoardMember4VoteTime || null;
        this._dateToHRC = rawAward.DateToHRC || null;
        this._dateToSOCOM = rawAward.dateToSOCOM || null;

        //With the date assignments below (accepted/QC/boarding) strip off the time portion of the date.
        this._dateAccepted = (rawAward.Date_x0020_Accepted) ? moment(rawAward.Date_x0020_Accepted).format("YYYY-MM-DD") : null;
        this._dateAwardComplete = (rawAward.DateComplete) ? moment(rawAward.DateComplete).format("YYYY-MM-DD") : null;

        this._dateSentToQC = (rawAward.DateSentToQC) ? moment(rawAward.DateSentToQC).format("YYYY-MM-DD") : null;
        this._dateCompleteQC = (rawAward.DateCompletedQC) ? moment(rawAward.DateCompletedQC).format("YYYY-MM-DD") : null;

        this._dateStartBoarding = (rawAward.DateSentToBoarding) ? moment(rawAward.DateSentToBoarding).format("YYYY-MM-DD") : null;
        this._dateCompleteBoarding = (rawAward.Date_x0020_Boarding_x0020_Comple) ? moment(rawAward.Date_x0020_Boarding_x0020_Comple).format("YYYY-MM-DD") : null;

        //Date mailed
        this._dateMailed = (rawAward.DateMailed) ?  moment(rawAward.DateMailed).format("YYYY-MM-DD") : null;

        //Award was completed in the current year and date completed has a value.  This award is considered 'Complete' for app purposes.
        //The suitability of the award to be used in the matrix is further defined in data.servce
        this._useInMatrix = (this._dateAwardComplete) && (moment().format("YYYY") == moment(this._dateAwardComplete).format("YYYY") )
              
        //True if the award is used in the in-progress stats
        this._useInInprogress = false;

        //This award is to be used in the Complete Awards chart if has a valid complete and accepted date and completion date is less than/equal to a year old.
        this._useInChartComplete = (this._dateAwardComplete) && (this._dateAccepted) &&
          //  (moment.duration(moment().diff(moment(this._dateAwardComplete))).as('years') <= 1);
          (timeService.dateIsInTrailingYearInterval(this._dateAwardComplete));

        //This award to be used in the Boarding Time chart if time difference between completed award date and now is less than a year
        this._useInBoardingTimeChart = (this._dateAwardComplete) && (this._dateStartBoarding) && (this._dateCompleteBoarding) &&
         //   (moment.duration(moment().diff(moment(this._dateAwardComplete))).as('years') <= 1);
         (timeService.dateIsInTrailingYearInterval(this._dateAwardComplete));

        //This award to be used in the QC chart if time difference between completed award date and now is less than a year and both 
        //_dateSentToQC and _date CompleteQC are defined
        this._useInQCTimeChart = (this._dateAwardComplete) && (this._dateSentToQC) && (this._dateCompleteQC) &&
         //   (moment.duration(moment().diff(moment(this._dateAwardComplete))).as('years') <= 1);
            (timeService.dateIsInTrailingYearInterval(this._dateAwardComplete));

        /* This award will be counted in the in-progress stats as 'Mailed previous Week'.
         * The criteria is as follows: Target briefing date is every Monday. This metric will look back from previous Monday 
         * through last Sunday.  Example: Briefing date is 5/11/2020, so we include any awards that have been marked mailed between
         * (and including) 5/4/2020 - 5/10/2020.
         */
         this._mailedThisWeek = (this._dateMailed) && timeService.dateIsInPreviousWeekInterval(this._dateMailed); 


        //If the award is not complete, then that means that it is currently in some state of the awards process per the data pull filter
        //
        //In the case of 'Ready for Distribution', these are awards that have a complete timestamp and are tracked in the in-progress tables.  As such, these 
        // awards will show up in both matrix and in-progress table. Awards that have been mailed this week must have an award status of 'Archived' per J1.
        //Note that awards that have been 'mailedThisWeek' can appear both in matrix as well as in-progress tables since they are 'Complete' but still being worked by J1.
        
        if (this._awardStatus == 'Ready for Distribution' || !this._useInMatrix || this._mailedThisWeek) {

            switch (this._awardStatus) {

                case 'Pending Review':
                case 'Pending Review (Resubmit)':
                case 'Accept for Action':
                case 'Accept for Action - Resubmit':
                case 'Accept for Action - ReQC':
                    this._awardState = 'New Submissions';
                    this._useInInprogress = true;
                    break;

                case 'J1 QC Review':
                case 'SJS QC Review':
                    this._awardState = 'J1QC';
                    this._useInInprogress = true;
                    break;

                case 'Ready for Boarding':
                    this._awardState = 'Ready for Boarding';
                    this._useInInprogress = true;
                    break;

                case 'Board Member 1 Review':
                case 'Board Member 2 Review':
                case 'Board Member 3 Review':
                case 'Board Member 4 Review':
                case 'Board Member 5 Review':   
                case 'Board Member 6 Review':
                    this._awardState = 'Board Members';
                    this._useInInprogress = true;
                    break;

                case 'Boarding Complete':
                    this._awardState = 'Boarding Complete';
                    this._useInInprogress = true;
                    break;


                case 'Pending CG Signature':
                    this._awardState = 'CMD GRP';   
                    this._useInInprogress = true;
                    break;

                case 'With HRC':
                case 'With SOCOM':
                    this._awardState = 'With SOCOM/HRC';
                    this._useInInprogress = true;
                    break;

                case 'Ready for Distribution':
                    this._awardState = 'J1 Final Stages';
                    this._useInInprogress = true;
                    break;

                default:
                    //Grab awards that have been mailed the previous week but don't have 'Award Status' of 'Ready for Distribution' ==> These should only be be 'Archived' awards, but put this in just in case.
                    if (this._mailedThisWeek && this._awardStatus == "Archived") {
                        this._awardState = 'Mailed Previous Week'; 
                        this._useInInprogress = true;
                    }
                    /* Unkown award type.  If we reach this condition and the award is 'Archived', it is most likely an award that was set to 'Complete' 
                     * in a previous year. We can ignore these 'Archived' awards as they should not show up in current year matrix and are not 'in progress'.
                     */
                     else if (this._awardStatus != 'Archived') {
                        console.error("Unable to determine matrix status of award id '"+this._awardNumber+"' with award status '"+this._awardStatus+"'. This will be categorized as 'Unkown' in 'Award Tracker' in progress awards table.");
                        this._awardState = 'Unknown';
                        this._useInInprogress = true;
                    }
                    /* This award does not meet any criteria to include in the in-progress metrics.
                    * This could be, for example, an award that is 'Complete' in a previous year and should therefore simply be ignored.
                    */
                    else {
                        console.log("Ignoring the award with id '"+this._awardNumber+"' with award status '"+this._awardStatus+"' This award does not meet any of the criteria to include in 'Award Tracker' or 'Award Breakdown'  metrics." );
                    }
                
                    
                  
            }



        }


    } //constructor

     get awardType() {
         return this._awardType;
     }

     get awardSubType() {
         return this._awardSubType;
     }

     get organization() {
         return this._organization;
     }

     get subOrganization() {
         return this._subordinateUnit;
     }

     get awardStatus() {
         return this._awardStatus;
     }

     get completionDate() {
         return this._dateAwardComplete;
     }

     get qcCompletionDate() {
         return this._dateCompleteQC;
     }


     get boardingCompletionDate() {
         return this._dateCompleteBoarding
     }

    //Returns true if an award should be used in matrix calculations
    get useInMatrix(): boolean {
        return this._useInMatrix;
    }

    set useInMatrix(value:boolean) {
        this._useInMatrix = value;
    }

     get useInChartComplete() {
         return this._useInChartComplete
     }

     get useInBoardingTimeChart() {
         return this._useInBoardingTimeChart;
     }

      get useInQCTimeChart() {
         return this._useInQCTimeChart;

     }

     get useInInprogress() {
         return this._useInInprogress
     }

     set useInInprogress(value:boolean) {
         this._useInInprogress = value;
     }

    getData(): string {
        return this._awardNumber+"  "+this._dateAccepted;
    }

    get awardNumber() {
        return this._awardNumber;
    }

    get completionDays() {
        const completeDate = moment(this._dateAwardComplete,"YYYY-MM-DD");
        const acceptedDate = moment(this._dateAccepted,"YYYY-MM-DD");


        return moment.duration(completeDate.diff(acceptedDate)).as('days');
      
    }

    get boardingDays() {


       const boardStart = moment(this._dateStartBoarding,"YYYY-MM-DD");
        const boardEnd = moment(this._dateCompleteBoarding,"YYYY-MM-DD");

        return moment.duration(boardEnd.diff(boardStart)).as('days');

    }

    get qcDays() {

        const qcStart = moment(this._dateSentToQC,"YYYY-MM-DD");
        const qcEnd = moment( this._dateCompleteQC,"YYYY-MM-DD");

        return moment.duration(qcEnd.diff(qcStart)).as('days');
    
    }
     


    //Return the current status of the award   
    get awardState() : string {
        return this._awardState;
    }

     
}
