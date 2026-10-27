namespace db;

using {cuid} from '@sap/cds/common';

entity Leave : cuid {
    reason    : String(100);
    fromDate  : Date;
    toDate    : Date;
    EmpID     : String(100);
    ApplyDate : Date;
    leaveType : String(100);
    status    : String enum {
        Approve = 'A';
        Pending = 'P';
        Declined = 'D';
    } default 'P';
}

entity LeaveAllocations : cuid {
    employeeId      : String(20);
    year            : Integer;
    leaveType       : String(100);
    totalAllocated  : Decimal(4, 1) default 0;
    expired         : Decimal(4, 1) default 0;
    used            : Decimal(4, 1) default 0;
    pendingApproval : Decimal(4, 1) default 0;
    available       : Decimal(4, 1) = totalAllocated - expired - used - pendingApproval;
}
