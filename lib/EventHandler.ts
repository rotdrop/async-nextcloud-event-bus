/*!
 * SPDX-FileCopyrightText: 2024, 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { EventSpec } from './Event'
import type { IsUndefined } from './types'

export type EventArgument<E extends EventSpec> =
	IsUndefined<E['arg']> extends true ? undefined : E['arg']

export type EventResult<E extends EventSpec> =
	IsUndefined<E['res']> extends true ? unknown : E['res']

export interface EventHandler<E extends EventSpec> {
  (event: EventArgument<E>): EventResult<E>|Promise<EventResult<E> >,
}
