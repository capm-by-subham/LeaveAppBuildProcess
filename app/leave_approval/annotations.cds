using LeaveService as service from '../../srv/model';
annotate service.leave with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'reason',
                Value : reason,
            },
            {
                $Type : 'UI.DataField',
                Label : 'fromDate',
                Value : fromDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'toDate',
                Value : toDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'reason',
            Value : reason,
        },
        {
            $Type : 'UI.DataField',
            Label : 'fromDate',
            Value : fromDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'toDate',
            Value : toDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
        },
    ],
);

