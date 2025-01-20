/*!
 * SPDX-FileCopyrightText: 2024, 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { EventBus } from './EventBus.ts'

declare global {
	const PACKAGE_VERSION: string

	interface Window {
          atRotDropAsyncNextcloudEventBus?: EventBus
	}
}

export {}
