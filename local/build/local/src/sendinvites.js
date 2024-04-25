import emailInfo from '../../server/build/server/src/assets/confidential.json' with { type: "json" };
import nodemailer from 'nodemailer';
import React from 'react';
import { Body, Container, Head, Html, Img, Link, Preview, Row, Section, Text, render, } from '@react-email/components';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { detailsAfternoonData, detailsEveningData, mainInviteData, rsvpData, } from './emailnvitedata.js';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailInfo.gmailLogin.email,
        pass: emailInfo.gmailLogin.password,
    },
});
const csv = readFileSync(`sendinvites.csv`);
const records = parse(csv, {
    bom: true,
    columns: true,
    skip_records_with_empty_values: true,
    skip_empty_lines: true,
    skip_records_with_error: true,
    skipEmptyLines: true,
    skipRecordsWithEmptyValues: true,
    skipRecordsWithError: true,
});
function InviteEmailPlainText({ afternoon, name, }) {
    return (React.createElement(Html, null,
        React.createElement(Head, null),
        React.createElement(Preview, null, "Invitation to the wedding of Adele Butcher & Matthew Byde"),
        React.createElement(Body, { style: main },
            React.createElement(Container, { style: container, align: 'center' },
                React.createElement(Section, null,
                    React.createElement(Text, { style: text }, `Dear ${name},`)),
                React.createElement(Section, null,
                    React.createElement(Row, null, `Together with their families, Adele Georgia Butcher & Matthew David Byde invite you to share in their wedding day, Saturday 09 November 2024.`),
                    React.createElement(Row, null,
                        "Details",
                        React.createElement("br", null),
                        "Monyhull Church: Wedding ceremony - 12:00, arrive from 11:30.",
                        React.createElement("br", null),
                        "Monyhull Church, St Francis Drive, Birmingham, B30 3PS",
                        React.createElement("br", null),
                        "\t",
                        React.createElement("br", null),
                        `Westmead Hotel: ${afternoon ? 'Wedding Breakfast - 14:30, ' : ''}Evening Celebration - 19:00.`,
                        React.createElement("br", null),
                        "Westmead Hotel, Redditch Road, Hopwood, Birmingham, B48 7AL.",
                        React.createElement("p", null, "If you wish to reserve a room for the night of the wedding at a discounted rate, call the hotel directly on 0121 445 12021 and quote group reference number BK144959."),
                        React.createElement("p", null,
                            "Please RSVP via our wedding website, matthewandadelewedding.co.uk \t",
                            React.createElement("br", null),
                            "Alternatively, please RSVP by phone.\t",
                            React.createElement("br", null),
                            "Adele - 07938051793\t",
                            React.createElement("br", null),
                            "Matthew - 07551169166")),
                    React.createElement(Row, null, "Please respond by June 14th."),
                    React.createElement(Row, null, "Thanks! From Adele and Matthew"))))));
}
function InviteEmail({ afternoon, name, }) {
    return (React.createElement(Html, null,
        React.createElement(Head, null),
        React.createElement(Preview, null, "Invitation to the wedding of Adele Butcher & Matthew Byde"),
        React.createElement(Body, { style: main },
            React.createElement(Container, { style: container, align: 'center' },
                React.createElement(Section, null,
                    React.createElement(Text, { style: text }, `Dear ${name},`)),
                React.createElement("span", { style: { color: '#ffffff' } }, "\"Together with their families, Adele Georgia Butcher & Matthew David Byde invite you to share in their wedding day, Saturday 09 November 2024 at 12 O'clock, Monyhull Church, St Francis Drive, Birmingham, B30 3PS\""),
                React.createElement(Section, { align: 'center', style: { maxWidth: '700px' } },
                    React.createElement(Row, { align: 'center' },
                        React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk', title: 'test', target: '_blank' },
                            React.createElement(Img, { src: 'cid:maininvite', alt: "Together with their families, Adele Georgia Butcher & Matthew David Byde invite you to share in their wedding day, Saturday 09 November 2024 at 12 O'clock, Monyhull Church, St Francis Drive, Birmingham, B30 3PS", width: '100%' }))),
                    React.createElement("span", { style: { color: '#ffffff' } }, `Details. Monyhull Church: Wedding ceremony - 12:00, arrive from 11:30. Monyhull Church, St Francis Drive, Birmingham, B30 3PS. Westmead Hotel: ${afternoon ? 'Wedding Breakfast - 14:30, ' : ''}Evening Celebration - 19:00. Westmead Hotel, Redditch Road, Hopwood, Birmingham, B48 7AL. If you wish to reserve a room for the night of the wedding at a discounted rate, call the hotel directly on 012144512021 and quote group reference number BK144959.`),
                    React.createElement(Row, { align: 'center' },
                        React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk', target: '_blank' },
                            React.createElement(Img, { src: 'cid:details', alt: `Details. Monyhull Church: Wedding ceremony - 12:00, arrive from 11:30. Monyhull Church, St Francis Drive, Birmingham, B30 3PS. Westmead Hotel: ${afternoon ? 'Wedding Breakfast - 14:30, ' : ''}Evening Celebration - 19:00. Westmead Hotel, Redditch Road, Hopwood, Birmingham, B48 7AL. If you wish to reserve a room for the night of the wedding at a discounted rate, call the hotel directly on 0121 445 12021 and quote group reference number BK144959.`, width: '100%' }))),
                    React.createElement("span", { style: { color: '#ffffff' } }, "\"RSVP. Please RSVP via our wedding website - go to matthew and adele wedding dot co dot uk . Alternatively, RSVP by phone: Adele - zero seven nine three eight zero five one seven nine three. Matthew - zero seven five five one one six nine one six six. Please respond by June 14th.\""),
                    React.createElement(Row, { align: 'center' },
                        React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk', target: '_blank' },
                            React.createElement(Img, { src: 'cid:rsvp', alt: 'RSVP. Please RSVP via our wedding website - go to matthewandadelewedding.co.uk . Alternatively, RSVP by phone: Adele - 07938051793. Matthew - 07551169166. Please respond by June 14th.', width: '100%' }))))))));
}
const main = {
    backgroundColor: '#f3f3f5',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
    width: '100%',
    minWidth: '100%',
};
const text = {
    color: '#333',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    margin: '24px',
};
const container = {
    width: '100%',
    minWidth: '100%',
    margin: '0 auto',
    backgroundColor: '#ffffff',
};
for (const record of records) {
    console.log("Sending", record);
    const email = {
        html: render(React.createElement(InviteEmail, { name: record.Names, afternoon: record.Afternoon === 'TRUE' }), { pretty: true }),
        plain: render(React.createElement(InviteEmailPlainText, { name: record.Names, afternoon: record.Afternoon === 'TRUE' }), {
            pretty: true,
            plainText: true,
        }),
    };
    transporter.sendMail({
        disableFileAccess: true,
        disableUrlAccess: true,
        from: {
            address: emailInfo.gmailLogin.email,
            name: 'Adele Butcher & Matthew Byde',
        },
        to: record.Email,
        text: email.plain,
        subject: 'Wedding invitation - Adele Butcher & Matthew Byde',
        html: email.html,
        attachments: [
            {
                cid: 'maininvite',
                filename: 'maininvite.png',
                content: Buffer.from(mainInviteData, 'base64'),
            },
            {
                cid: 'details',
                filename: 'details.png',
                content: Buffer.from(record.Afternoon === 'TRUE'
                    ? detailsAfternoonData
                    : detailsEveningData, 'base64'),
            },
            {
                cid: 'rsvp',
                filename: 'rsvp.png',
                content: Buffer.from(rsvpData, 'base64'),
            },
        ],
    });
    console.log("Sent", record);
}
