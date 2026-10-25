import cds from '@sap/cds'


export class LeaveService extends cds.ApplicationService {
  init() {

    const { leave } = this.entities;

    this.after('CREATE', leave, async (res, req) => {
      try {
        const leaveProcessTrigger = await cds.connect.to("LeaveProcessTrigger");
        await leaveProcessTrigger.post("/workflow/rest/v1/workflow-instances", {
          "definitionId": "us10.1d086f71trial.leaveapproval.leaveApproval",
          "context": {
            "id": req.data.ID,
            "reason": req.data.reason,
            "from": req.data.fromDate,
            "to": req.data.toDate
          }
        })
      } catch (error) {
        console.log(error);
      }
    })

    this.on('approveLeave', async (req) => {
      try {
        const { ID } = req.data;
        await UPDATE(leave, ID).set({ status: 'A' });
        return "Ok";
      } catch (error) {
        console.log(error);
        return "Error";
      }
    })
    this.on('rejectLeave', async (req) => {
      try {
        const { ID } = req.data;
        await UPDATE(leave, ID).set({ status: 'D' });
        return "Ok";
      } catch (error) {
        console.log(error);
        return "Error";
      }
    })

    return super.init()
  }
}
