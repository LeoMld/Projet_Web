const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});
module.exports = {
    //envoi du mail de confirmation lors de l'inscription
    send_conf_mail: async (req, res,mail,code)=> {
        return new Promise((resolve, reject )=> {
            try {
                const mailOptions = {
                    from: req.body.mail,
                    to: mail,
                    subject: "Confirmation compte StartConvey",
                    text: code,
                    html: '<h3>' + code + '</h3>'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                resolve(true);
            } catch (e) {
                reject("erreur lors de l'envoi du mail de confimation, votre mail est peut-être invalide");
            }
        })

    },
//envoi du mail de contact en footer
    send_mail_C: async (req)=> {
        const mailOptions = {
            from: req.body.mail,
            to: process.env.MAIL_DEST,
            subject: "Contact",
            text: req.body.message,
            html: '<b>'+'Message provenant de: ' + req.body.mail+'<br>'+ req.body.message + '</b>'
        };
        await transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    },
    //retourne un code de longueur 8 généré aléatoirement
    create_code: async ()=> {

        let code = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++ ) {
            code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return code;
    }
};
