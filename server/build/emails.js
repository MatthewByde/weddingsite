import emailInfo from './confidential.json' with { type: "json" };
import nodemailer from 'nodemailer';
import React from 'react';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text, render, } from '@react-email/components';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailInfo.gmailLogin.email,
        pass: emailInfo.gmailLogin.password
    },
});
export async function sendContactFormEmail(message, subject, fromName, userEmail) {
    const email = createContactFormEmail(message, fromName, subject, userEmail);
    return await sendEmail(email.plain, email.html, subject, fromName, emailInfo.contactFormToEmail, userEmail);
}
async function sendEmail(text, html, subject, fromName, to, replyTo) {
    const result = await transporter.sendMail({
        disableFileAccess: true,
        disableUrlAccess: true,
        from: { address: emailInfo.gmailLogin.email, name: fromName },
        to,
        text,
        subject,
        html,
        replyTo
    });
    return result;
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
                            React.createElement(Img, { src: "./assets/banner.png", width: '75', height: '45', alt: 'Matthew and adele wedding banner' }))),
                    React.createElement(Section, { style: upperSection },
                        React.createElement(Heading, { style: h1 }, `Contact form submission`),
                        React.createElement(Text, { style: mainText }, content.split(/\r\n|\r|\n/).map(e => {
                            return React.createElement(React.Fragment, null,
                                e,
                                React.createElement("br", null));
                        }))),
                    React.createElement(Hr, null),
                    React.createElement(Section, { style: lowerSection },
                        React.createElement(Text, { style: cautionText }, `The above message was sent by ${from} <${userEmail}> at ${new Date().toISOString()}.`))),
                React.createElement(Text, { style: footerText },
                    "This message was produced by ",
                    React.createElement(Link, { href: 'https://matthewandadelewedding.co.uk', target: '_blank', style: link }, "matthewandadelewedding.co.uk"),
                    " at request of a user, and may contain confidential information. If you have received this email in error, please delete it, then ",
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
    padding: '20px 0',
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
