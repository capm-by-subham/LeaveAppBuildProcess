using {db} from '../db/model';


service LeaveService {
    @odata.draft.enabled
    entity leave as
        projection on db.Leave {
            *,
            status @readonly
        };

    action approveLeave(ID: UUID) returns String(10);
    action rejectLeave(ID: UUID)  returns String(10);


}
