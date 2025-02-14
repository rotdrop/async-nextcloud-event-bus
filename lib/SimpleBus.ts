/*!
 * SPDX-FileCopyrightText: 2019, 2025, 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericEvents, AsyncNextcloudEvents } from './Event.js'
import type { EventBus, EventArg } from './EventBus.js'
import type { EventHandler } from './EventHandler.js'

export class SimpleBus<E extends GenericEvents = AsyncNextcloudEvents>
	implements EventBus<E>
{
	private handlers: { [K in keyof E]: EventHandler<E[K]>[] } = <typeof this.handlers>{};

	getVersion(): string {
		return PACKAGE_VERSION
	}

	subscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	) {
		this.handlers[name] = (this.handlers[name] || []).concat(handler)
		return handler
	}

	unsubscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): void {
		this.handlers[name] = (this.handlers[name] || []).filter((h) => h !== handler)
	}

	unsubscribeAll<EventName extends keyof E>(
		name: EventName,
	): void {
		delete this.handlers[name]
	}

	hasSubscriptions<EventName extends keyof E>(
		name: EventName,
	): boolean {
		return !!(this.handlers[name]?.length)
	}

	emit<EventName extends keyof E>(
		name: EventName,
		...event: EventArg<E, EventName>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) {
		const handlers = this.handlers[name] || []
		const results = handlers.map(async (h) => {
			try {
        return await h(event[0])
			} catch (e) {
				console.error('Could not invoke event listener', name, e, h)
				throw e
			}
		})
		return Promise.allSettled(results)
	}
}
