/**
 * SPDX-FileCopyrightText: 2019, 2025, 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { AsyncNextcloudEvents } from './Event.ts'
import type { EventArg } from './EventBus.ts'
import type { EventHandler } from './EventHandler.ts'

export type { EventArg, EventBus } from './EventBus.ts'
export type { EventHandler } from './EventHandler.ts'
export type { AsyncNextcloudEvents, EventSpec } from './Event.ts'

import { SimpleBus } from './SimpleBus.ts'

declare global {
	var atRotDropAsyncNextcloudEventBus: SimpleBus
}

if (!globalThis.atRotDropAsyncNextcloudEventBus) {
	globalThis.atRotDropAsyncNextcloudEventBus = new SimpleBus()
}
const bus: SimpleBus = globalThis.atRotDropAsyncNextcloudEventBus

/**
 * Register an event listener
 *
 * @param name name of the event
 * @param handler callback invoked for every matching event emitted on the bus
 */
export function subscribe<K extends keyof AsyncNextcloudEvents>(
	name: K,
	handler: EventHandler<AsyncNextcloudEvents[K]>,
) {
	return bus.subscribe(name, handler)
}

/**
 * Unregister a previously registered event listener
 *
 * Note: doesn't work with anonymous functions (closures). Use method of an object or store listener function in variable.
 *
 * @param name name of the event
 * @param handler callback passed to `subscribed`
 */
export function unsubscribe<K extends keyof AsyncNextcloudEvents>(
	name: K,
	handler: EventHandler<AsyncNextcloudEvents[K]>,
) {
	bus.unsubscribe(name, handler)
}

/**
 * Emit an event
 *
 * @param name name of the event
 * @param event event payload
 */
export function emit<K extends keyof AsyncNextcloudEvents>(
	name: K,
	...event: EventArg<AsyncNextcloudEvents, K>
) {
	return bus.emit(name, ...event)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isOne = (x: any): x is 1 => x === 1

/**
 * Lax parsing of the all-settled result with only minimal error diagnostics.
 *
 * @param result Promise or fulfilled result of Promise.allSettled()
 *
 * @param count Default 1, how many items to expect at least.
 *
 * @return Data items of just the first data item if count === 1.
 */
export async function getEmitResult<
	K extends keyof AsyncNextcloudEvents,
	N extends number = 1,
>(result: ReturnType<typeof emit<K>> | Awaited<ReturnType<typeof emit<K>>>, count?: N): Promise<N extends 1 ? AsyncNextcloudEvents[K]['res'] : AsyncNextcloudEvents[K]['res'][]> {
	const awaitedResult = await result
	const values = awaitedResult.filter((item) => item.status === 'fulfilled').map((item) => item.value)

	if (values.length < (count ?? 1)) {
		throw new Error('Not enough fulfilled data items in Promise.allSettled() result.')
	}
	// @ts-expect-error 2322 Return type deduction mismatch, unclear why.
	return isOne(count ?? 1) ? values[0] : values
}

/**
 * Emit an event and fetch the first result available. Despite its
   name this function is (and must be) async and hence returns a
   promise which has to be awaited for in order to get hold of the
   actual value.
 *
 * @param name name of the event
 * @param event event payload
 */
export async function awaitEmit<K extends keyof AsyncNextcloudEvents>(name: K, ...event: EventArg<AsyncNextcloudEvents, K>) {
	const result = emit(name, ...event)
	return getEmitResult<K>(result)
}

/**
 * Unsubscribe all subscribers for an event.
 *
 * @param name name of the event
 */
export function unsubscribeAll<K extends keyof AsyncNextcloudEvents>(name: K): void {
	bus.unsubscribeAll(name)
}

/**
 * Check if the given event has any subscribers.
 *
 * @param name The name of the event to examine.
 */
export function hasSubscriptions<K extends keyof AsyncNextcloudEvents>(name: K): boolean {
	return bus.hasSubscriptions(name)
}
