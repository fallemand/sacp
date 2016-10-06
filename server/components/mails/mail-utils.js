/**
 * Created by falle on 25/05/2016.
 */

'use strict';

export function sendMail(template, context, recipient) {
    context.url = 'http://www.sacp.com.ar';
    var nodemailer = require('nodemailer');
    var mg = require('nodemailer-mailgun-transport');
    var template = getTemplate(template, context);

    // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
    var auth = {
        auth: {
            api_key: 'key-645047b67ce236522257b2fe1243f4fe',
            domain: 'sacp.com.ar'
        }
    };

    var nodemailerMailgun = nodemailer.createTransport(mg(auth));

    nodemailerMailgun.sendMail({
        from: '"Sistema S.A.C.P." <contacto@sacp.com.ar>',
        to: recipient, // An array if you have multiple recipients.
        //cc:'second@domain.com',
        //bcc:'secretagent@company.gov',
        subject: template.subject,
        //You can use "html:" to send HTML email content. It's magic!
        html: template.body
        //You can use "text:" to send plain-text content. It's oldschool!
        //text: 'Mailgun rocks, pow pow!'
    }, function (err, info) {
        if (err) {
            console.log('Error: ' + err);
        }
    });
}

function getTemplate(template, context) {
    var fs = require('fs');
    var Handlebars = require('handlebars');
    var mailTemplate = fs.readFileSync('./server/components/mails/' + template + '.hbs', 'utf8');
    mailTemplate = Handlebars.compile(mailTemplate);
    Handlebars.registerPartial('_footer', fs.readFileSync('./server/components/mails/_footer.hbs', 'utf8'));
    Handlebars.registerPartial('_header', fs.readFileSync('./server/components/mails/_header.hbs', 'utf8'));
    Handlebars.registerHelper('formatDate', function(date) {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    });

    var result={};
    switch(template) {
        case 'activation':
            result.subject = 'Tu cuenta ha sido activada';
            result.body = mailTemplate(context);
            break;
        case 'treatment-change':
            result.subject = 'El tratamiento #' + context._id + ' ha cambiado de estado';
            result.body = mailTemplate(context);
            break;
    }
    return result;
}
