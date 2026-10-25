sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"leaveapproval/test/integration/pages/leaveList.gen",
	"leaveapproval/test/integration/pages/leaveObjectPage.gen"
], function (JourneyRunner, leaveListGenerated, leaveObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('leaveapproval') + '/test/flp.html#app-preview',
        pages: {
			onTheleaveListGenerated: leaveListGenerated,
			onTheleaveObjectPageGenerated: leaveObjectPageGenerated
        },
        async: true
    });

    return runner;
});

