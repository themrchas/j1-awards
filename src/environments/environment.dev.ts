export const environment = {
  production: false,
  listWeb: "http://localhost:8080/sites/dev/socafdev/",

  listName: "AwardsMetrics",
  //hostDocLibrary:"AwardsApp",
 // configPath: "./config.txt",
  configPath: "http://localhost:8080/sites/dev/socafdev/AwardsApp/config.txt",
  doLog: true,

  filter: 
     [
                  "startswith(AwardStatus,'Pending Review') or startswith(AwardStatus,'Accept for')",
                  "or (AwardStatus eq 'J1 QC Review') or (AwardStatus eq 'SJS QC Review') or (AwardStatus eq 'Ready for Boarding') or startswith(AwardStatus,'Board Member ')",
                  "or (AwardStatus eq 'Pending CG Signature' ) or (AwardStatus eq 'Boarding Complete') or (AwardStatus eq 'With HRC') or (AwardStatus eq 'With SOCOM')"
    ]


};
