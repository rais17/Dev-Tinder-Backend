const cron = require("node-cron");
const Connections = require("../models/Connections");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const transporter = require('./nodemailer');

cron.schedule("0 8 * * *", async () => {

    try {

        const yesterday = subDays(new Date(), 1);
        const yesterdayStartOfDay = startOfDay(yesterday);
        const yesterdayEndOfDay = endOfDay(yesterday);

        const requests = await Connections.find({
            status: 'interested',
            $and: [
                { createdAt: { $gte: yesterdayStartOfDay } },
                { createdAt: { $lt: yesterdayEndOfDay } }

            ]
        }).populate("fromUserId", "firstName lastName email")
            .populate("toUserId", "firstName lastName email");

        const pendingRequest = {};

        requests.forEach((request) => {
            const toEmail = request.toUserId.email;
            if (!pendingRequest.hasOwnProperty(toEmail)) pendingRequest[toEmail] = new Set();
            pendingRequest[toEmail].add(request.fromUserId);
        });

        for (let email in pendingRequest) {
            if (pendingRequest.hasOwnProperty(email))
                pendingRequest[email] = Array.from(pendingRequest[email]);
        }

        await transporter.sendMail({
            from: '"DevTinder" <nehalarshad11@gmail.com>',
            to: "arshadrais0017@gmail.com",
            subject: "Pending Request",
            text: "You Have Connection Request Pending From Yesterday", // plain‑text body
            html: "<b>You Have Connection Request Pending From Yesterday</b>", // HTML body
        })

    } catch (error) {
        console.error('Error in Cron Schedule', error);
    }
})