namespace db;

using {cuid} from '@sap/cds/common';

entity Leave : cuid {
    reason   : String(100);
    fromDate : Date;
    toDate   : Date;
    status   : String enum {
        Approve = 'A';
        Pending = 'P';
        Declined = 'D';
    } default 'P';
}
