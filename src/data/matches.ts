/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authoritative ESPN Official Match Service
 * Zero mock/default/fake matches in production pipeline.
 */

import { Match } from '../types/football.js';

export function generateDefaultMatches(): Match[] {
  return [];
}

export const MATCHES_DATA: Match[] = [];
