/* eslint-disable no-mixed-spaces-and-tabs */
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const CONTACT_NAME_MAXCHARS = 50;
export const CONTACT_MESSAGE_MAXCHARS = 10000;
export const CONTACT_SUBJECT_MAXCHARS = 255;
export const EMAILDOMAIN_MAXCHARS = 255;
export const EMAILLOCAL_MAXCHARS = 64;

export const RSVP_FIRSTNAME_MAXCHARS = 25;
export const RSVP_SURNAME_MAXCHARS = 25;
export const RSVP_DIETARY_MAXCHARS = 1000;
export const RSVP_COMMENTS_MAXCHARS = 1000;

export type SendEmailRequestBody = {
	name: string;
	email: string;
	message: string;
	subject: string;
};

export type SendEmailRequestResponse =
	| SMTPTransport.SentMessageInfo
	| { errorMessage: string };

export type RSVPStoredJSONSchema = {
	invites: {
		[inviteId: number]: {
			responded: boolean;
			invitedToAfternoon: boolean;
			data: string;
			names: string[];
		};
	};
	people: {
		[name: string]: number;
	};
};

export type RSVPRawJSONSchema = {
	people: {
		[name: string]: number;
	};
	invites: {
		[inviteId: number]: {
			responded: boolean;
			invitedToAfternoon: boolean;
			names: string[];
			data: {
				email?: string;
				time?: string;
				ip?: string;
				people?: {
					afternoon?: boolean;
					evening?: boolean;
					ceremony?: boolean;
					dietary?: string;
					comments?: string;
					noAlcohol?: boolean;
					vegetarian?: boolean;
					pescetarian?: boolean;
					name?: string;
				}[];
			};
		};
	};
};

export type UpdateRSVPRequestBody = {
	name: string;
	data: string;
	invitedToAfternoon?: boolean;
	email?: string;
	adminAuth?: string;
	clientEncrypted?: boolean;
};

export type UpdateRSVPRequestResponse =
	| {
			errorMessage: string;
	  }
	| undefined;

export type AuthRequestResponse =
	| {
			nonce: string;
	  }
	| { errorMessage: string };

export type GetRSVPRequestBody = {
	nonce: string;
};

export type GetRSVPRequestResponse =
	| RSVPStoredJSONSchema
	| { errorMessage: string };

export type CheckRSVPRequestResponse<T extends ResponseType> = object &
	(T extends 'success'
		? {
				responded: boolean;
				invitedToAfternoon: boolean;
				peopleOnInvite: string[];
		  }
		: { errorMessage: string });

export type ResponseType = 'error' | 'success';
