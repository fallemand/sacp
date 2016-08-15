/**
 * Created by falle on 25/05/2016.
 */

'use strict';

export function processQuery(model, query, options) {
    query.sorting = (query.sorting) ? JSON.parse(query.sorting) : {};
    options.sort = (Object.keys(query.sorting).length > 0) ? JSON.parse(query.sorting) : options.sort;
    options.page = (query.page) ? parseInt(query.page) : 1;
    options.limit = (query.count) ? parseInt(query.count) : 50;
    var populateFilter;

    if (query.filter) {
        var filters = JSON.parse(query.filter);
        for (var filter in filters) {
            if (filters[filter] && filters[filter] !== '') {
                if (filter.indexOf('.') > -1) {
                    var field = filter.substr(0, filter.indexOf('.'));
                    var descField = filter.substr(filter.indexOf('.') + 1, filter.length);
                    var populate = {};
                    populate.path = field;
                    populate.match = {};
                    if(descField === '_id') {
                        populate.match[descField] = filters[filter];
                    }
                    else {
                        populate.match[descField] = new RegExp(filters[filter], 'i');
                    }

                    options.populate.push(populate);
                    populateFilter = field;
                }
                else {
                    if(filter === 'or') {
                        var orFilters = filters[filter].replace('[','').replace(']','');
                        orFilters = orFilters.split('&');
                        var array = [];

                        for(var orFilter in orFilters) {
                            var object = {};
                            var key =  orFilters[orFilter].substring(0,  orFilters[orFilter].indexOf('='));
                            var value =  orFilters[orFilter].substring(orFilters[orFilter].indexOf('=') + 1,  orFilters[orFilter].length);
                            object[key] = new RegExp(value, 'i');
                            array.push(object);
                        }
                        query.$or = array;
                    }
                    else {
                        query[filter] = new RegExp(filters[filter], 'i');
                    }
                }
            }
        }
    }

    delete query.page;
    delete query.count;
    delete query.sorting;
    delete query.filter;

    if (!populateFilter) {
        return model.paginate(query, options);
    }
    else {
        return model.paginate(query, options).then(function(documents) {
            documents.docs = documents.docs.filter(function (document) {
                return document[populateFilter];
            });
            return documents;
        });
    }
}

export function sendMail(template, context) {
    var nodemailer = require('nodemailer');
    var mg = require('nodemailer-mailgun-transport');
    var template = getTemplate(template, context);

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
    var auth = {
        auth: {
            api_key: 'key-645047b67ce236522257b2fe1243f4fe',
            domain: 'sacp.com.ar'
        }
    }

    var nodemailerMailgun = nodemailer.createTransport(mg(auth));

    nodemailerMailgun.sendMail({
        from: '"Sistema S.A.C.P." <contacto@sacp.com.ar>',
        to: context.user.email, // An array if you have multiple recipients.
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
        else {
            console.log('Response: ' + info);
        }
    });
}

function getTemplate(template, context) {
    var result={};
    switch(template) {
        case 'activation':
            result.subject = 'Tu cuenta ha sido activada';
            result.body = '<!DOCTYPE html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> </head> <body class="" style="color: #424242; background-color: #f6f6f6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0;" bgcolor="#f6f6f6"><style type="text/css">.btn-primary table td:hover{background-color: #108798 !important;}.btn-primary a:hover{background-color: #108798 !important; border-color: #34495e !important;}/* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px){.header{padding: 8px 15px !important; font-size:13px !important; background-color: #0ba0b5; color:#fff;}table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}</style> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;" bgcolor="#f6f6f6"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top"> </td><td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; width: 580px; margin: 0 auto; padding: 10px;" valign="top"> <div class="content" style="box-sizing: border-box; display: block; max-width: 580px; margin: 0 auto; padding: 10px;"> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Su cuenta ha sido aprobada por un administrado! Ya puede ingresar al sistema.</span> <table style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="logo" style="width: 80px; font-size: 20px; color: #fff; font-family: sans-serif; vertical-align: top; background-color: #37425d; padding: 10px 20px;" bgcolor="#37425d" valign="top"> S.A.C.P. </td><td class="header" style="font-size: 14px; color: #fff; font-family: sans-serif; vertical-align: top; background-color: #0ba0b5; padding: 15px 20px 10px;" bgcolor="#0ba0b5" valign="top"> Sistema de Auditoría y Control de Prescripciones </td></tr></table> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; border-radius: 3px; background-color: #fff;" bgcolor="#fff"> <tr> <td class="wrapper" colspan="2" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0 0 15px;">Buen día ' + context.user.name + ',</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0 0 15px;">Su cuenta ha sido aprobada por un administrador. <br>Ya puede hacer uso del sistema ingresando con su email y contraseña</p><table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" align="center" bgcolor="#3498db" valign="top"> <a href="' + context.url + '" target="_blank" style="color: #ffffff; text-decoration: none; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 13px; background-color: #0ba0b5; margin: 0; padding: 6px 12px; border: #3498db;">Ingresar al sistema</a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></table> </td></tr></table> <div class="footer" style="clear: both; padding-top: 10px; text-align: center; width: 100%;" align="center"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block" style="font-family: sans-serif; font-size: 11px; vertical-align: top; color: #999999; text-align: center;" align="center" valign="top"> <span class="apple-link" style="color: #999999; font-size: 11px; text-align: center;">Sistema de Autorización de Prescripciones Médicas</span> <br>¿No queres recibir estos emails? <a href="http://sacp.com.ar/unsuscribe' +context.unsubscribeHash +'" style="color: #999999; font-size: 11px; text-align: center; text-decoration: underline;">Desuscribirse</a>. </td></tr></table> </div></div></td><td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top"> </td></tr></table> </body></html>'
    }
    return result;
}
