import { DeviceTypes, ElectricalMeasurement, EveHistory, OnOff } from 'matterbridge';

import { Matterbridge, MatterbridgeDevice, MatterbridgeAccessoryPlatform, MatterHistory } from 'matterbridge';
import { AnsiLogger } from 'node-ansi-logger';

export class EveEnergyPlatform extends MatterbridgeAccessoryPlatform {
  energy: MatterbridgeDevice | undefined;
  history: MatterHistory | undefined;
  interval: NodeJS.Timeout | undefined;

  constructor(matterbridge: Matterbridge, log: AnsiLogger) {
    super(matterbridge, log);
  }

  override async onStart(reason?: string) {
    this.log.info('onStart called with reason:', reason ?? 'none');

    this.history = new MatterHistory(this.log, 'Eve energy', { filePath: this.matterbridge.matterbridgeDirectory });

    this.energy = new MatterbridgeDevice(DeviceTypes.ON_OFF_PLUGIN_UNIT);
    this.energy.createDefaultIdentifyClusterServer();
    this.energy.createDefaultBasicInformationClusterServer('Eve energy', '0x88528475', 4874, 'Eve Systems', 80, 'Eve Energy 20EBO8301', 6650, '3.2.1', 1, '1.1');
    this.energy.createDefaultScenesClusterServer();
    this.energy.createDefaultGroupsClusterServer();
    this.energy.createDefaultOnOffClusterServer(true);
    this.energy.createDefaultElectricalMeasurementClusterServer();

    this.energy.createDefaultPowerSourceWiredClusterServer();

    // Add the EveHistory cluster to the device as last cluster!
    this.energy.createEnergyEveHistoryClusterServer(this.history, this.log);
    this.history.autoPilot(this.energy);

    await this.registerDevice(this.energy);

    this.energy.addCommandHandler('identify', async ({ request: { identifyTime } }) => {
      this.log.warn(`Command identify called identifyTime:${identifyTime}`);
      this.history?.logHistory(false);
    });
  }

  override async onConfigure() {
    this.log.info('onConfigure called');

    this.interval = setInterval(
      () => {
        if (!this.energy || !this.history) return;
        let state = this.energy.getClusterServerById(OnOff.Cluster.id)?.getOnOffAttribute();
        state = !state;
        const voltage = this.history.getFakeLevel(210, 235, 2);
        const current = state === true ? this.history.getFakeLevel(0.05, 10.5, 2) : 0;
        const power = state === true ? this.history.getFakeLevel(0.5, 1550, 2) : 0;
        const consumption = this.history.getFakeLevel(0.5, 1550, 2);
        this.energy.getClusterServerById(OnOff.Cluster.id)?.setOnOffAttribute(state);
        this.energy.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setRmsVoltageAttribute(voltage);
        this.energy.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setRmsCurrentAttribute(current);
        this.energy.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setActivePowerAttribute(power);
        this.energy.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setTotalActivePowerAttribute(consumption);
        this.energy.getClusterServerById(EveHistory.Cluster.id)?.setVoltageAttribute(voltage);
        this.energy.getClusterServerById(EveHistory.Cluster.id)?.setCurrentAttribute(current);
        this.energy.getClusterServerById(EveHistory.Cluster.id)?.setConsumptionAttribute(power);
        this.energy.getClusterServerById(EveHistory.Cluster.id)?.setTotalConsumptionAttribute(consumption);
        this.history.setLastEvent();
        this.history.addEntry({ time: this.history.now(), status: state === true ? 1 : 0, voltage, current, power, consumption });
        this.log.info(`Set state to ${state} voltage:${voltage} current:${current} power:${power} consumption:${consumption}`);
      },
      60 * 1000 - 200,
    );
  }

  override async onShutdown(reason?: string) {
    this.log.info('onShutdown called with reason:', reason ?? 'none');
    await this.history?.close();
    clearInterval(this.interval);
  }
}
