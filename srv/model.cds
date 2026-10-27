using {db} from '../db/model';


service LeaveService {
    @odata.draft.enabled
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
    entity LeaveAllocations as projection on db.LeaveAllocations;

    action applyLeave(leaveType: String(100),
                      empID: String(20),
                      fromDate: Date,
                      toDate: Date,
                      postDate: Date,
                      reason: String(500)) returns String(100);

    action approveLeave(ID: UUID)          returns String(10);
    action rejectLeave(ID: UUID)           returns String(10);
}
