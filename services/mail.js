const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'startconvey.supp@gmail.com',
        pass: 'b0ws1999'
    }
});
module.exports = {
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
    /*send_mail_C: async (req,res)=> {
        try{

            if (!REGEX_MAIL.test(req.body.mail) || req.body.message == '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ status: 400 }));
                res.end();
            }else{
                const mailOptions = {
                    from: req.body.mail,
                    to: "lele.mollard@gmail.com",
                    subject: "Contact",
                    text: req.body.message,
                    html: '<b>' + req.body.message + '</b>'
                };
                await transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ status: 200 }));
                res.end();
            }
        }catch (e) {
            const flash = {
                type: "alert-danger",
                code: 401,
                mess: e,
            };
            cookie_mdl.setFlash(flash,res);
            res.redirect('/');
        }
    },*/
    send_mail_C: async (req)=> {
        const mailOptions = {
            from: req.body.mail,
            to: "lele.mollard@gmail.com",
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
