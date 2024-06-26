/* eslint-disable no-mixed-spaces-and-tabs */
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const CONTACT_NAME_MAXCHARS = 50;
export const CONTACT_MESSAGE_MAXCHARS = 10000;
export const CONTACT_SUBJECT_MAXCHARS = 255;
export const EMAILDOMAIN_MAXCHARS = 255;
export const EMAILLOCAL_MAXCHARS = 64;

export const RSVP_FIRSTNAME_MAXCHARS = 25;
export const RSVP_SURNAME_MAXCHARS = 25;
export const RSVP_FULLNAME_MAXCHARS = 51; //one for a space
export const RSVP_DIETARY_MAXCHARS = 1000;
export const RSVP_COMMENTS_MAXCHARS = 1000;
export const RSVP_LOCATION_MAXCHARS = 500;

export const UNKNOWN_GUEST_NAME = 'Additional guest (+1)';

export type PKRequestResponse =
	| {
			pk: string;
	  }
	| { errorMessage: string };

export type SendEmailRequestBody = {
	name: string;
	email: string;
	message: string;
	subject: string;
};

export type DeleteInviteRequestBody = {
	nonce: string;
	inviteId: string;
};

export type DeleteInviteRequestResponse = object | { errorMessage: string };

export type SendEmailRequestResponse =
	| SMTPTransport.SentMessageInfo
	| { errorMessage: string };

export type RSVPStoredJSONSchema = {
	[inviteId: string]: {
		doNotEmail: boolean;
		submittedBy?: string;
		invitedToAfternoon: boolean;
		data: string;
		peopleOnInvite: {
			displayName: string;
			altNames: string[];
		}[];
		plusOnes?: number;
	};
};

export type RSVPRawJSONSchema = {
	[inviteId: string]: {
		doNotEmail: boolean;
		submittedBy?: string;
		invitedToAfternoon: boolean;
		peopleOnInvite: {
			displayName: string;
			altNames: string[];
		}[];
		plusOnes?: number;
		data: {
			email?: string;
			time?: string;
			liftSpaces?: number;
			ceremonyLift?: boolean;
			locationLift?: string;
			needOrCanGiveLift?: 'need' | 'give' | 'none';
			liftEmailConsent?: boolean;
			people?: {
				afternoon?: boolean;
				evening?: boolean;
				ceremony?: boolean;
				dietary?: string;
				comments?: string;
				noAlcohol?: boolean;
				vegetarian?: boolean;
				pescetarian?: boolean;
				name: {
					displayName: string;
					altNames: string[];
				};
			}[];
		};
	};
};

export type UpdateRSVPRequestBody = {
	inviteId: string;
	adminAuth?: string;
	emailUpdates?: boolean;
	emailReceipt?: boolean;
	submitterName?: string;
	invitedToAfternoon?: boolean;
	plusOnes?: number;
} & RSVPRawJSONSchema[string]['data'];

export type UpdateRSVPRequestResponse =
	| {
			errorMessage: string;
	  }
	| object;

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
				submittedBy?: string;
				invitedToAfternoon: boolean;
				peopleOnInvite: {
					displayName: string;
					altNames: string[];
				}[];
				inviteId: string;
				plusOnes?: number;
		  }
		: { errorMessage: string });

export type ResponseType = 'error' | 'success';
