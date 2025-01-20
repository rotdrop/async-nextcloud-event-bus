/*!
 * SPDX-FileCopyrightText: 2019, 2025, 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type EventArgument = object | number | string | boolean | null | undefined;

export type EventSpec = {
  arg?: EventArgument,
  res?: unknown,
}

/**
 * Generic events mapping, fallback if no explicit types events are defined
 *
 * @see AsyncNextcloudEvents
 */
export type GenericEvents = Record<string | symbol, EventSpec>

/**
 * Nextcloud EventBus events
 * This can be extended to allow typing of events like:
 *
 * @example
 * ```ts
 * // event-bus.d.ts
 * // Extend the Nextcloud events interface for your custom event
 * declare module '@rotdrop/async-nextcloud-event-bus' {
 *     export interface AsyncNextcloudEvents {
 *         // mapping of 'event name' => 'event type'
 *         'my-event': { foo: number, bar: boolean }
 *     }
 * }
 * export {}
 *
 * // your-code.ts
 * import { subscribe } from '@rotdrop/async-nextcloud-event-bus'
 * // Here the type of 'params' is inferred automatically
 * subscribe('my-event', (params) => { console.debug(params.foo, params.bar) })
 * ```
 */
export interface AsyncNextcloudEvents {
	[eventName: string | symbol]: EventSpec
}
