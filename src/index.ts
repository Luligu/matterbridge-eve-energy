import { Matterbridge, PlatformConfig } from 'matterbridge';
import { AnsiLogger } from 'matterbridge/logger';

import { EveEnergyPlatform } from './platform.js';

/**
 * This is the standard interface for MatterBridge plugins.
 * Each plugin should export a default function that follows this signature.
 *
 *  @param {Matterbridge} matterbridge - The Matterbridge instance.
 *  @param {AnsiLogger} log - The logger instance for logging messages.
 *  @param {PlatformConfig} config - The configuration for the platform.
 *  @returns {EveEnergyPlatform} - An instance of the EveEnergyPlatform.
 */
export default function initializePlugin(matterbridge: Matterbridge, log: AnsiLogger, config: PlatformConfig): EveEnergyPlatform {
  return new EveEnergyPlatform(matterbridge, log, config);
}
