/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Patient from '../api/patient/patient.model';
import AgreementType from '../api/agreement-type/agreement-type.model';
import Cie10Disease from '../api/cie10-disease/cie10-disease.model';
import TreatmentType from '../api/treatment-type/treatment-type.model';
import TreatmentState from '../api/treatment-state/treatment-state.model';
import DiseaseStage from '../api/disease-stage/disease-stage.model';
import Treatment from '../api/treatment/treatment.model';
import DrugType from '../api/drug-type/drug-type.model';


// TreatmentType.find({}).remove()
//     .then(() => {
//         TreatmentType.create({
//             name: 'Adyuvante'
//         }, {
//             name: 'Neo-Adyuvante'
//         }, {
//             name: 'Avanzado'
//         })
//     });

// DiseaseStage.find({}).remove()
//     .then(() => {
//         DiseaseStage.create({
//             name: '0'
//         },{
//             name: 'I'
//         }, {
//             name: 'II'
//         }, {
//             name: 'III'
//         }, {
//             name: 'IV'
//         }, {
//             name: 'Desconocido'
//         })
//     });



// TreatmentState.find({}).remove()
//     .then(() => {
//         TreatmentState.create({
//             _id: 'EA',
//             name: 'En Auditoria'
//         }, {
//             _id: 'AP',
//             name: 'Aprobado'
//         },{
//             _id: 'EE',
//             name: 'En Espera'
//         },{
//             _id: 'PA',
//             name: 'Pausado'
//         }, {
//             _id: 'CA',
//             name: 'Cancelado'
//         })
//     });

// Treatment.find({}).remove();
//
// DrugType.find({}).remove()
//     .then(() => {
//         DrugType.create({
//             name: 'Ampolla'
//         }, {
//             name: 'Comprimido'
//         })
//     });
//
// User.find({}).remove()
//     .then(() => {
//         User.create({
//                 provider: 'local',
//                 name: 'Test User',
//                 email: 'test@example.com',
//                 password: 'test',
//                 mn: '1',
//                 me: '1',
//                 active: true
//
//             }, {
//                 provider: 'local',
//                 role: 'admin',
//                 name: 'Admin',
//                 email: 'admin@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: true
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'admin1@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: true
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'adm2@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: true
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad3n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad4n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'adm5@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad6n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'adm7@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad8n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad9n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad0n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             }, {
//                 provider: 'local',
//                 name: 'Admin',
//                 email: 'ad55n@example.com',
//                 password: 'admin',
//                 mn: '1',
//                 me: '1',
//                 active: false
//             })
//             .then(() => {
//                 console.log('finished populating users');
//             });
//     });

// AgreementType.find({}).remove()
//     .then(() => {
//         AgreementType.create({
//             name: 'PROFE'
//         }, {
//             name: 'Carenciado'
//         }, {
//             name: 'DOSEP'
//         }).then(() => {
//             console.log('finished populating agreement types');
//             Patient.find({}).remove()
//                 .then(() => {
//                     AgreementType.findOne({name: 'DOSEP'}, function (err, doc) {
//                         Patient.create({
//                             name: 'Fran Carvallo',
//                             registeredBy: '576ecb91007d1ef0044a86f9',
//                             email: 'bgbgyu@hotmail.com',
//                             dni: '12589698',
//                             socialInsuranceNumber: '23425456',
//                             address: 'Hidalgo Palacios 7542',
//                             phone: '+43532656565',
//                             cellphone: '3513160678',
//                             agreementType: doc._id
//                         }).then(() => {
//                             console.log('finished populating patients');
//                         });
//                     });
//                     AgreementType.findOne({name: 'Carenciado'}, function (err, doc) {
//                         Patient.create({
//                             name: 'Manuel Sanchez',
//                             registeredBy: '576ecb91007d1ef0044a86f9',
//                             email: 'asdasd@hotmail.com',
//                             dni: '36142871',
//                             socialInsuranceNumber: '23425456',
//                             address: 'Hidalgo Palacios 7542',
//                             phone: '+43532656565',
//                             cellphone: '3513160678',
//                             agreementType: doc._id
//                         }).then(() => {
//                             console.log('finished populating patients');
//                         });
//                     });
//                     AgreementType.findOne({name: 'PROFE'}, function (err, doc) {
//                         Patient.create({
//                             name: 'Juan Carlos',
//                             registeredBy: '576ecb91007d1ef0044a86f8',
//                             email: 'juancarlos@hotmail.com',
//                             dni: '13658987',
//                             socialInsuranceNumber: '23425456',
//                             address: 'Hidalgo Palacios 7542',
//                             phone: '+43532656565',
//                             cellphone: '3513160678',
//                             agreementType: doc._id
//                         }).then(() => {
//                             console.log('finished populating patients');
//                         });
//                     });
//                 });
//         });
//     });
