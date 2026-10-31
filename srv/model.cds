using {db} from '../db/model';


// @requires: 'MobileIntegration'

service LeaveService {
    @odata.draft.enabled

    // @restrict: [{
    //     grant: 'READ',
    //     to   : 'MobileIntegration',
    //     where: 'EmpID = $user.InfraID'
    // }]
    @requires: 'MobileIntegration'
    entity leave            as
        projection on db.Leave {
            *,
            status @readonly,
            case
                status
                when 'A'
                     then 'Approved'
                when 'P'
                     then 'Pending'
                when 'D'
                     then 'Declined'
                else 'Unknow'
            end as statusText : String(10)
        };

    @readonly
    // @requires: 'tech_user'
    entity LeaveAllocations as projection on db.LeaveAllocations;

    action applyLeave(leaveType: String(100),
                      empID: String(20),
                      fromDate: Date,
                      toDate: Date,
                      postDate: Date,
                      reason: String(500))                  returns String(100);

    action approveLeave(ID: UUID)                           returns String(10);
    action rejectLeave(ID: UUID, rejectReason: String(200)) returns String(10);
}
