/**
 * This file contains the class EveEnergyPlatform.
 *
 * @file module.ts
 * @author Luca Liguori
 * @version 2.0.0
 * @license Apache-2.0
 *
 * Copyright 2023, 2024, 2025, 2026 Luca Liguori.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EveHistory, MatterHistory } from 'matter-history';
import { PlatformConfig, MatterbridgeAccessoryPlatform, powerSource, MatterbridgeEndpoint, onOffOutlet, PlatformMatterbridge } from 'matterbridge';
import { OnOff } from 'matterbridge/matter/clusters';
import { AnsiLogger } from 'matterbridge/logger';

/**
 * This is the standard interface for MatterBridge plugins.
 * Each plugin should export a default function that follows this signature.
 *
 *  @param {PlatformMatterbridge} matterbridge - The Matterbridge instance.
 *  @param {AnsiLogger} log - The logger instance for logging messages.
 *  @param {PlatformConfig} config - The configuration for the platform.
 *  @returns {EveEnergyPlatform} - An instance of the EveEnergyPlatform.
 */
export default function initializePlugin(matterbridge: PlatformMatterbridge, log: AnsiLogger, config: PlatformConfig): EveEnergyPlatform {
  return new EveEnergyPlatform(matterbridge, log, config);
}

export class EveEnergyPlatform extends MatterbridgeAccessoryPlatform {
  energy: MatterbridgeEndpoint | undefined;
  history: MatterHistory | undefined;
  interval: NodeJS.Timeout | undefined;
  state = false;

  constructor(matterbridge: PlatformMatterbridge, log: AnsiLogger, config: PlatformConfig) {
    super(matterbridge, log, config);

    // Verify that Matterbridge is the correct version
    if (this.verifyMatterbridgeVersion === undefined || typeof this.verifyMatterbridgeVersion !== 'function' || !this.verifyMatterbridgeVersion('3.3.0')) {
      throw new Error(
        `This plugin requires Matterbridge version >= "3.3.0". Please update Matterbridge from ${this.matterbridge.matterbridgeVersion} to the latest version in the frontend."`,
      );
    }

    this.log.info('Initializing platform:', this.config.name);
  }

  override async onStart(reason?: string) {
    this.log.info('onStart called with reason:', reason ?? 'none');

    this.history = new MatterHistory(this.log, 'Eve energy', { filePath: this.matterbridge.matterbridgeDirectory, enableDebug: this.config.debug as boolean });

    this.energy = new MatterbridgeEndpoint(
      [onOffOutlet, powerSource],
      { uniqueStorageKey: 'Eve energy', mode: this.matterbridge.bridgeMode === 'bridge' ? 'server' : undefined },
      this.config.debug as boolean,
    );
    this.energy.createDefaultIdentifyClusterServer();
    this.energy.createDefaultBasicInformationClusterServer('Eve energy', '0x88528475', 4874, 'Eve Systems', 80, 'Eve Energy 20EBO8301', 6650, '3.2.1', 1, '1.1');
    // this.energy.createDefaultScenesClusterServer();
    this.energy.createDefaultGroupsClusterServer();
    this.energy.createDefaultOnOffClusterServer(true);
    this.energy.createDefaultPowerSourceWiredClusterServer();

    // Add the EveHistory cluster to the device as last cluster!
    this.history.createEnergyEveHistoryClusterServer(this.energy, this.log);
    this.history.autoPilot(this.energy);

    await this.registerDevice(this.energy);

    this.energy.addCommandHandler('identify', async ({ request: { identifyTime } }) => {
      this.log.info(`Command identify called identifyTime:${identifyTime}`);
      this.history?.logHistory(false);
    });

    this.energy.addCommandHandler('triggerEffect', async ({ request: { effectIdentifier, effectVariant } }) => {
      this.log.info(`Command triggerEffect called effect ${effectIdentifier} variant ${effectVariant}`);
      this.history?.logHistory(false);
    });
  }

  override async onConfigure() {
    this.log.info('onConfigure called');

    this.interval = setInterval(
      async () => {
        if (!this.energy || !this.history) return;
        this.state = !this.state;
        const voltage = this.history.getFakeLevel(210, 235, 2);
        const current = this.state === true ? this.history.getFakeLevel(0.05, 10.5, 2) : 0;
        const power = this.state === true ? this.history.getFakeLevel(0.5, 1550, 2) : 0;
        const consumption = this.history.getFakeLevel(0.5, 1550, 2);
        await this.energy.setAttribute(OnOff.Cluster.id, 'onOff', this.state, this.log);
        await this.energy.setAttribute(EveHistory.Cluster.id, 'voltage', voltage, this.log);
        await this.energy.setAttribute(EveHistory.Cluster.id, 'current', current, this.log);
        await this.energy.setAttribute(EveHistory.Cluster.id, 'consumption', power, this.log);
        await this.energy.setAttribute(EveHistory.Cluster.id, 'totalConsumption', consumption, this.log);
        this.history.setLastEvent();
        this.history.addEntry({ time: this.history.now(), status: this.state === true ? 1 : 0, voltage, current, power, consumption });
        this.log.info(`Set state to ${this.state} voltage:${voltage} current:${current} power:${power} consumption:${consumption}`);
      },
      60 * 1000 - 200,
    );
  }

  override async onShutdown(reason?: string) {
    this.log.info('onShutdown called with reason:', reason ?? 'none');
    await this.history?.close();
    clearInterval(this.interval);
    if (this.config.unregisterOnShutdown === true) await this.unregisterAllDevices();
  }
}
