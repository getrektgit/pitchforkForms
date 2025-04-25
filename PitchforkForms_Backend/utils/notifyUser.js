const nodemailer = require("nodemailer");
const dbQuery = require("./queryHelper");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function notifyUser(form_id) {
    try {
        const form = await dbQuery("SELECT name FROM forms WHERE id = ?", [form_id]);
        if (form.length === 0) {
            console.log("Nem létezik ilyen form.");
            return;
        }
        const formName = form[0].name;

        const students = await dbQuery(
            `SELECT u.email FROM users u
             JOIN sent_forms sf ON sf.user_id = u.id
             WHERE sf.form_id = ? AND u.role = 'student'`,
            [form_id]
        );

        if (!students.length) {
            console.log("Nincs kiküldendő email.");
            return;
        }

        for (const student of students) {
            const subject = `Új űrlap érkezett: ${formName}`;
            const text = `Kedves Diák!<br><br>
                Új űrlap érkezett számodra a Pitchfork Forms rendszerén keresztül: <strong>${formName}</strong>.<br>
                Kérjük, lépj be a rendszerbe, és töltsd ki a hozzád rendelt űrlapot.<br><br>
                Üdvözlettel,<br>
                Pitchfork Forms csapat`;

            await transporter.sendMail({
                from: '"Pitchfork Forms" <noreply@pitchforkforms.eu>',
                to: student.email,
                subject: subject,
                html: text,
            });

            //console.log(`Értesítő email elküldve: ${student.email}`);
        }
    } catch (error) {
        console.error("Email küldési hiba:", error);
    }
}

module.exports = notifyUser;
