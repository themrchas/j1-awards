
import * as moment from 'moment';

export class Award {

    private static awardBreakDown: any = {};
    private static totalAwards: number = 0;
    
    

    private _awardNumber: string;
    private _awardType: string;
    private _awardSubType: string;

    private _organization: string;
    private _subordinateUnit: string;



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

    constructor(rawAward: any) {

        this._awardNumber  = rawAward.AwardNumber || null;
        this._awardType = rawAward.AwardType || null;
        this._awardSubType = rawAward.AwardSubType || null;

        this._organization = rawAward.Organization || null;
        this._subordinateUnit = rawAward.subOrganization || null;


        this._dateAccepted = rawAward.DateAccepted || null;
        this._dateAwardComplete = rawAward.DateComplete || null;
        this._dateSentToQC = rawAward.DateSentToQc || null;
        this._dateCompleteQC = rawAward.DateCompletedQC || null;
        this._dateStartBoarding = rawAward.DateSentToBoarding || null;
        this._dateCompleteBoarding = rawAward.DateBoardingComplete || null;
        this._bm1VoteDate = rawAward.BoardMember1VoteDate || null;
        this._bm2VoteDate = rawAward.BoardMember2VoteDate || null;
        this._bm3VoteDate = rawAward.BoardMember3VoteDate || null;
        this._bm4VoteDate = rawAward.BoardMember4VoteDate || null;
        this._dateToHRC = rawAward.DateToHRC || null;
        this._dateToSOCOM = rawAward.dateToSOCOM || null;

     //   this.categorizeAward(this._organization,this._awardType,this._subordinateUnit,this._awardSubType)


        
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

   

    getData(): string {
        return this._awardNumber+"  "+this._dateAccepted;
    }

    get awardNumber() {
        return this._awardNumber;
    }

    get completionDays() {
        const completeDate = moment(this._dateAwardComplete,"YYYY-MM-DD");
        const acceptedDate = moment(this._dateAccepted,"YYYY-MM-DD");

       // console.log('completeDate', completeDate);
       // console.log('acceptedDate', acceptedDate);

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

     

     

      


}
