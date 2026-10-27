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
            this.getView().byId("idDateAndReason").setModel(this.oLeaveModel, "Leave");
            this.getView().byId("idApproval").setModel(this.oLeaveModel, "Leave");

            this.byId("idFromDate").setMinDate(new Date());
        },
        async onApplyLeave() {
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
                .setParameter("reason", dateReason.reason)
                .setParameter("postDate", approval.postDate);

            try {
                await oAction.invoke();
                const sResult = oAction.getBoundContext().getObject().value;
                MessageBox.show(sResult);
                if (sResult === "Leave Request Appled");
                this.byId("idLeaveAllocation").getBinding("items")?.refresh();

                setTimeout(() => { this.onNavBack() }, 2000)
            } catch (oError) {
                MessageBox.error(oError.message);
            }
        },
        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("LeaveReport", null, null, true);
        },
        onCancel() {
            this.getOwnerComponent().getRouter().navTo("LeaveReport", null, null, true);
        },
        onPickFromDate(oEvent) {
            this.byId("idToDate").setMinDate(new Date(oEvent.mParameters.newValue));
        }
    })
});