sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("leaveapplication.controller.Home", {
        onInit() {
            this.model = this.getOwnerComponent().getModel();
        },
        onAfterRendering() {
            this.oLeaveModel = new JSONModel({
                LeaveRequest: {
                    series: "HR-LAP-.YYYY.-",
                    employeeId: "INT01185",
                    employeeName: "SUBHAM SAHOO",
                    leaveType: "",
                    company: "InfraBeat Technologies Pvt. Ltd.",
                    reportingManager: "Prachi Kharde",
                    department: "SAP Technical",
                    subDepartment: "BTP - ITPL"
                },
                dateReason: {
                    from: "",//yyyy-MM-dd
                    to: "",
                    reason: "",
                    halfDay: false
                },
                approval: {
                    from: "prachi.kharde@infrabeat.com",
                    name: "Prachi Kharde",
                    viaEmail: true,
                    postDate: new Date().toLocaleDateString("en-CA")
                }
            });
            this.model.bindList("/LeaveAllocations");

            this.getView().byId("idLeaveApplyForm").setModel(this.oLeaveModel, "Leave");
            this.getView().byId("idDatendReason").setModel(this.oLeaveModel, "Leave");
            this.getView().byId("idApproval").setModel(this.oLeaveModel, "Leave");
        },
        async onSave() {
            const { LeaveRequest, dateReason, approval } = this.oLeaveModel.getData();
            if (
                LeaveRequest.series &&
                LeaveRequest.employeeId &&
                LeaveRequest.leaveType &&
                LeaveRequest.company &&
                dateReason.from &&
                dateReason.to &&
                dateReason.reason?.trim() &&
                approval.postDate
            ) {
                this.requestLeave();
            } else {
                MessageBox.error("Please fill all mandatory fields.");
            }
        },
        async requestLeave() {
            const { LeaveRequest, dateReason, approval } = this.oLeaveModel.getData();
            const oModel = this.model;
            const oAction = oModel.bindContext("/applyLeave(...)");

            oAction
                .setParameter("leaveType", LeaveRequest.leaveType)
                .setParameter("empID", LeaveRequest.employeeId)
                .setParameter("fromDate", dateReason.from)
                .setParameter("toDate", dateReason.to)
                .setParameter("reason", dateReason.reason);

            try {
                await oAction.invoke();                         // execute() on UI5 < 1.123
                const sResult = oAction.getBoundContext().getObject().value;
                MessageBox.show(sResult);
            } catch (oError) {
                MessageBox.error(oError.message);
            }
        }
    })
});