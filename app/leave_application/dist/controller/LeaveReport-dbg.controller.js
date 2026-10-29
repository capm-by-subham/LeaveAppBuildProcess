sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("leaveapplication.controller.LeaveReport", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("LeaveReport").attachPatternMatched(this._onMatched, this);
            this.model = this.getOwnerComponent().getModel();
        },
        async _onMatched() {
            this.byId("idLeaveReport").getBinding("items")?.refresh();
        },
        onAfterRendering() { },
        onAddLeave() {
            this.getOwnerComponent().getRouter().navTo("AddLeave", null, null, true);
        },
        onFilter() {
            const aFilters = [];

            const sEmp = this.byId("fEmpId").getValue().trim();
            if (sEmp) {
                aFilters.push(new Filter({ path: "EmpID", operator: FilterOperator.Contains, value1: sEmp, caseSensitive: false }));
            }

            const aStatus = this.byId("fStatus").getSelectedKeys();
            if (aStatus.length) {
                aFilters.push(new Filter({
                    filters: aStatus.map(k => new Filter("status", FilterOperator.EQ, k)),
                    and: false
                }));
            }

            const aTypes = this.byId("fLeaveType").getSelectedKeys();
            if (aTypes.length) {
                aFilters.push(new Filter({
                    filters: aTypes.map(t => new Filter("leaveType", FilterOperator.EQ, t)),
                    and: false
                }));
            }

            this.byId("idLeaveReport").getBinding("items")
                .filter(aFilters.length ? new Filter({ filters: aFilters, and: true }) : []);
        },
        onRefresh() {
            this.byId("idLeaveReport").getBinding("items")?.refresh();
        }
    })
});