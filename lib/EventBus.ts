/**
 * SPDX-FileCopyrightText: 2024, 2025, 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericEvents, AsyncNextcloudEvents } from './Event'
import type { EventHandler, EventArgument } from './EventHandler'
import type { IsUndefined } from './types.ts'

export type EventArg<E extends GenericEvents, EventName extends keyof E> =
	IsUndefined<EventArgument<E[EventName]> > extends true ? [] : [EventArgument<E[EventName]>];

export interface EventBus<E extends GenericEvents = AsyncNextcloudEvents> {
	/**
	 * Subscribe the event bus
	 *
	 * @param name Name of the event to subscribe
	 * @param handler Handler invoked when receiving the event
	 */
	subscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): EventHandler<E[EventName]>

	/**
	 * Unsubscribe a handler on one event from the event bus
	 *
	 * @param name Name of the event to unsubscribe
	 * @param handler Handler to unsubscribe
	 */
	unsubscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): void

	/**
	 * Unsubscribe all handlers for the given event name.
	 * @param name Name of the event to unsubscribe
	 */
	unsubscribeAll<EventName extends keyof E>(
		name: EventName,
	): void

	/**
	 * Check whether there are currently handlers installed for name.
	 * @param name Name of the event to unsubscribe
	 */
	hasSubscriptions<EventName extends keyof E>(
		name: EventName,
	): boolean

	/**
	 * Emit an event on the event bus
	 *
	 * @param name Name of the event to emit
	 * @param event Event payload to emit
	 */
	emit<EventName extends keyof E>(
		name: EventName,
		...event: EventArg<E, EventName>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): Promise<PromiseSettledResult<E[EventName]['res']>[]>
}
