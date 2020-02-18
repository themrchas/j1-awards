
import * as moment from 'moment';

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

    //True if the award was completed in current year and completed date is not null
    private _useInMatrix: boolean;

    //True if award has been completed in the past 12 months (default) and has a valid DateAccepted amd DateComplete.  These two items 
    //are required to calculate a 'days taken to process' metric
    private _useInChartComplete: boolean;

    //True if the award is complete in the past 12 months (default) and has a valid DateSentToBoarding, DateCompleteBoarding, and DateComplete timestamp
    private _useInBoardingTimeChart: boolean;

    //True if this award has a completion time in the past 12 months (defualt) and has a valid DateSentToQC and DateCompleteQC timestamp
    private _useInQCTimeChart: boolean;

    
    constructor(rawAward: any) {

        let currentYear = moment().format("YYYY")

        this._awardNumber  = rawAward.AwardNumber || null;
        this._awardType = rawAward.AwardType || null;
        this._awardSubType = rawAward.AwardSubType || null;

        this._organization = rawAward.Organization || null;
        this._subordinateUnit = rawAward.subOrganization || null;

        this._awardStatus = rawAward.AwardStatus || null;
        this._dateAccepted = rawAward.DateAccepted || null;
        this._dateAwardComplete = rawAward.DateComplete || null;
        this._dateSentToQC = rawAward.DateSentToQC || null;
        this._dateCompleteQC = rawAward.DateCompletedQC || null;
        this._dateStartBoarding = rawAward.DateSentToBoarding || null;
        this._dateCompleteBoarding = rawAward.DateBoardingComplete || null;
        this._bm1VoteDate = rawAward.BoardMember1VoteDate || null;
        this._bm2VoteDate = rawAward.BoardMember2VoteDate || null;
        this._bm3VoteDate = rawAward.BoardMember3VoteDate || null;
        this._bm4VoteDate = rawAward.BoardMember4VoteDate || null;
        this._dateToHRC = rawAward.DateToHRC || null;
        this._dateToSOCOM = rawAward.dateToSOCOM || null;

        //Award was completed in the current year and date completed has a value
        this._useInMatrix = ( rawAward.DateComplete ) && ( moment().format("YYYY") == moment(rawAward.DateComplete).format("YYYY") );

        //This award is to be used in the Complete Awards chart if has a valid complete and accepted date and completion date is less than/equal to a year old
        this._useInChartComplete = ( this._dateAwardComplete ) && (this._dateAccepted) && 
            ( moment.duration(moment().diff(moment(this._dateAwardComplete))).as('years') <= 1);

        //This award to be used in the Boarding Time chart if time difference between completed award date and now is less than a year
        this._useInBoardingTimeChart = ( this._dateAwardComplete ) && (this._dateStartBoarding) && ( this._dateCompleteBoarding) &&
            ( moment.duration(moment().diff(moment(this._dateAwardComplete))).as('years') <= 1);

        //This award to be used in the QC chart if time difference between completed award date and now is less than a year and both 
        //_dateSentToQC and _date CompleteQC are defined
        this._useInQCTimeChart = ( this._dateAwardComplete ) && (this._dateSentToQC) && ( this._dateCompleteQC) &&
        ( moment.duration(moment().diff(moment(this._dateAwardComplete))).as('years') <= 1);


        //If the award is not complete, then that means that it is currently in some state of the awards process per the data pull filter
        //Need to verify 'CMD GRP', 'J1 Final Stages', and 'Mailed this week' with J1
        if (!this._useInMatrix) {

            switch(this._awardStatus) {

                case  'Pending Review':
                case  'Pending Review (Resubmit)':
                case  'Accept for Action':
                case  'Accept for Action - Resubmit':
                    this._awardState = 'New Submissions';
                    break;
                
                case 'J1 QC Review':
                    this._awardState = 'J1QC';
                    break;

                case 'Ready for Boarding': 
                    this._awardState = 'Ready for Boarding';
                    break;

                case 'Board Member 1 Review':
                case 'Board Member 2 Review':
                case 'Board Member 3 Review':
                case 'Board Member 4 Review':
                case 'Board Member 6 Review':
                    this._awardState = 'Board Members';
                    break;

                default:
                    console.log('Unable to determine matrix status of this._awardStatus',this._awardStatus);
                    this._awardState = 'Unkown';

            }



        }

             
    }

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

     get useInChartComplete() {
         return this._useInChartComplete
     }

     get useInBoardingTimeChart() {
         return this._useInBoardingTimeChart;
     }

      get useInQCTimeChart() {
         return this._useInQCTimeChart;
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
