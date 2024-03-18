import emailInfo from './confidential.json' with { type: 'json' };
import nodemailer from 'nodemailer';
import React from 'react';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text, render, } from '@react-email/components';
import { imageData } from './emailBannerData.js';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailInfo.gmailLogin.email,
        pass: emailInfo.gmailLogin.password,
    },
});
export async function sendContactFormEmail(message, subject, fromName, userEmail) {
    message = message.slice(0, 10000);
    subject = subject.slice(0, 255);
    fromName = fromName.slice(0, 255);
    const [localPart, domainPart] = userEmail.split('@', 1);
    if (localPart && domainPart) {
        userEmail = `${localPart.slice(0, 64)}@${domainPart.slice(0, 255)}`;
    }
    else {
        userEmail = userEmail.slice(0, 64);
    }
    const email = createContactFormEmail(message, fromName, subject, userEmail);
    return await sendEmail(email.plain, email.html, subject, fromName, emailInfo.contactFormToEmail, [{ cid: 'image', filename: 'image.png', content: Buffer.from(imageData, 'base64') }], userEmail);
}
async function sendEmail(text, html, subject, fromName, to, attachments, replyTo) {
    return await transporter.sendMail({
        disableFileAccess: true,
        disableUrlAccess: true,
        from: { address: emailInfo.gmailLogin.email, name: fromName },
        to,
        text,
        subject,
        html,
        replyTo,
        attachments
    });
}
function createContactFormEmail(emailContent, emailFrom, emailSubject, userEmail) {
    return {
        html: render(React.createElement(ContactFormEmail, { from: emailFrom, content: emailContent, subject: emailSubject, userEmail: userEmail }), { pretty: true }),
        plain: render(React.createElement(ContactFormEmail, { from: emailFrom, content: emailContent, subject: emailSubject, userEmail: userEmail }), { pretty: true, plainText: true }),
    };
}
function ContactFormEmail({ from, subject, content, userEmail, }) {
    return (React.createElement(Html, null,
        React.createElement(Head, null),
        React.createElement(Preview, null, `Submission through matthewandadelewedding.co.uk contact form from ${from}: ${subject}`),
        React.createElement(Body, { style: main },
            React.createElement(Container, { style: container },
                React.createElement(Section, { style: coverSection },
                    React.createElement(Section, { style: imageSection },
                        React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk', target: '_blank' },
                            React.createElement(Img, { src: 'cid:image', alt: 'Matthew and adele wedding banner', width: '100%', className: 'm-0 border-0 p-0 block' }))),
                    React.createElement(Section, { style: upperSection },
                        React.createElement(Heading, { style: h1 }, `Contact form submission: ${subject}`),
                        React.createElement(Text, { style: mainText }, content.split(/\r\n|\r|\n/).map((e) => {
                            return (React.createElement(React.Fragment, null,
                                e,
                                React.createElement("br", null)));
                        }))),
                    React.createElement(Hr, null),
                    React.createElement(Section, { style: lowerSection },
                        React.createElement(Text, { style: cautionText }, `The above message was sent by ${from} <${userEmail}> at ${new Date().toISOString()}.`))),
                React.createElement(Text, { style: footerText },
                    'This message was produced by ',
                    React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk', target: '_blank', style: link }, "matthewandadelewedding.co.uk"),
                    ' at request of a user, and may contain confidential information. If you have received this email in error, please delete it, then ',
                    React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk/contact', target: '_blank', style: link }, "contact us"),
                    ".")))));
}
const main = {
    backgroundColor: '#fff',
    color: '#212121',
};
const container = {
    padding: '20px',
    margin: '0 auto',
    backgroundColor: '#eee',
    width: 'min-content',
};
const h1 = {
    color: '#333',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
};
const link = {
    color: '#2754C5',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    textDecoration: 'underline',
};
const text = {
    color: '#333',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    margin: '24px 0',
};
const imageSection = {
    backgroundColor: '#E9EDEA',
    display: 'flex',
    paddingTop: '20px',
    alignItems: 'center',
    justifyContent: 'center',
};
const coverSection = { backgroundColor: '#fff' };
const upperSection = { padding: '25px 35px' };
const lowerSection = { padding: '25px 35px' };
const footerText = {
    ...text,
    fontSize: '12px',
    padding: '0 20px',
};
const mainText = { ...text, marginBottom: '14px' };
const cautionText = { ...text, margin: '0px' };
