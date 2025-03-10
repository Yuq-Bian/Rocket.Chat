declare module 'meteor/rocketchat:streamer' {
	type Connection = any;

	type Client = {
		meteorClient: boolean;
		ws: any;
		userId?: string;
		send: Function;
	};

	interface IPublication {
		onStop: Function;
		stop: Function;
		connection: Connection;
		_session: {
			sendAdded(publicationName: string, id: string, fields: Record<string, any>): void;
			userId?: string;
			socket?: {
				send: Function;
			};
		};
		ready: Function;
		userId: string | undefined;
		client: Client;
	}

	type Rule = (this: IPublication, eventName: string, ...args: any) => Promise<boolean | object>;

	interface IRules {
		[k: string]: Rule;
	}

	type DDPSubscription = {
		eventName: string;
		subscription: IPublication;
	};

	type TransformMessage = (
		streamer: IStreamer,
		subscription: DDPSubscription,
		eventName: string,
		args: any[],
		allowed: boolean | object,
	) => string | false;

	interface IStreamer {
		serverOnly: boolean;

		subscriptions: Set<DDPSubscription>;

		subscriptionName: string;

		allowEmit(eventName: string | boolean | Rule, fn?: Rule | 'all' | 'none' | 'logged'): void;

		allowWrite(eventName: string | boolean | Rule, fn?: Rule | 'all' | 'none' | 'logged'): void;

		allowRead(eventName: string | boolean | Rule, fn?: Rule | 'all' | 'none' | 'logged'): void;

		emit(event: string, ...data: any[]): void;

		on(event: string, fn: (...data: any[]) => void): void;

		removeSubscription(subscription: DDPSubscription, eventName: string): void;

		removeListener(event: string, fn: (...data: any[]) => void): void;

		__emit(...data: any[]): void;

		_emit(eventName: string, args: any[], origin: Connection | undefined, broadcast: boolean, transform?: TransformMessage): boolean;

		emitWithoutBroadcast(event: string, ...data: any[]): void;

		changedPayload(collection: string, id: string, fields: Record<string, any>): string | false;

		_publish(publication: IPublication, eventName: string, options: boolean | { useCollection?: boolean; args?: any }): Promise<void>;
	}

	interface IStreamerConstructor {
		new (name: string, options?: { retransmit?: boolean; retransmitToSelf?: boolean }): IStreamer;
	}
}
