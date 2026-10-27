sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
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
        }
    })
});