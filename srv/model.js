import cds from '@sap/cds'

export class LeaveService extends cds.ApplicationService {
  init() {

    const { leave, LeaveAllocations } = this.entities;

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
        const leaveDetails = await SELECT.one.from(leave).where({ ID });

        let iDays = 0;
        for (let d = new Date(leaveDetails.fromDate); d <= new Date(leaveDetails.toDate); d.setDate(d.getDate() + 1)) {
          if (d.getDay() !== 0 && d.getDay() !== 6) iDays++;
        }
        await UPDATE(LeaveAllocations)
          .set({ used: { '+=': iDays }, pendingApproval: { '-=': 1 } })
          .where({ employeeId: leaveDetails.EmpID, leaveType: leaveDetails.leaveType });

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
        const leaveDetails = await SELECT.one.from(leave).where({ ID });

        await UPDATE(LeaveAllocations)
          .set({ pendingApproval: { '-=': 1 } })
          .where({ employeeId: leaveDetails.EmpID, leaveType: leaveDetails.leaveType });
        return "Ok";
      } catch (error) {
        console.log(error);
        return "Error";
      }
    })

    this.on('applyLeave', async (req) => {
      try {
        const { leaveType,
          empID,
          fromDate,
          toDate,
          postDate,
          reason } = req.data;

        const availLeave = Number((await SELECT.one.from(LeaveAllocations)
          .where({ employeeId: empID, leaveType: leaveType }))?.available);

        let iDays = 0;
        for (let d = new Date(fromDate); d <= new Date(toDate); d.setDate(d.getDate() + 1)) {
          if (d.getDay() !== 0 && d.getDay() !== 6) iDays++;
        }

        if (!availLeave || availLeave < iDays) {
          return "You Don't Have enough Leave"
        }

        const leaveObject = {
          reason: reason,
          fromDate: fromDate,
          toDate: toDate,
          leaveType: leaveType,
          EmpID: empID,
          ApplyDate: postDate
        };

        await INSERT.into(leave).entries(leaveObject);
        await UPDATE(LeaveAllocations)
          .set({ pendingApproval: { '+=': 1 } })
          .where({ employeeId: empID, leaveType });

        const leaveProcessTrigger = await cds.connect.to("LeaveProcessTrigger");
        await leaveProcessTrigger.post("/workflow/rest/v1/workflow-instances", {
          "definitionId": "us10.1d086f71trial.leaveapproval.leaveApproval",
          "context": {
            "id": leaveObject.ID,
            "reason": leaveObject.reason,
            "from": leaveObject.fromDate,
            "to": leaveObject.toDate,
            "empid": empID,
            "leavetype": leaveType
          }
        })

        return "Leave Request Appled";
      } catch (error) {
        console.log(error);
        return "Error";
      }
    })

    return super.init()
  }
}
