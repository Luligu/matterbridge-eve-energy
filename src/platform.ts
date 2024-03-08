import { DeviceTypes, ElectricalMeasurement, EveHistory, OnOff, logEndpoint } from 'matterbridge';

import { Matterbridge, MatterbridgeDevice, MatterbridgeAccessoryPlatform, MatterHistory } from 'matterbridge';
import { AnsiLogger } from 'node-ansi-logger';

export class EveEnergyPlatform extends MatterbridgeAccessoryPlatform {
  constructor(matterbridge: Matterbridge, log: AnsiLogger) {
    super(matterbridge, log);
  }

  override async onStart(reason?: string) {
    this.log.info('onStart called with reason:', reason ?? 'none');

    const history = new MatterHistory(this.log, 'Eve energy', { filePath: this.matterbridge.matterbridgeDirectory });

    const energy = new MatterbridgeDevice(DeviceTypes.ON_OFF_PLUGIN_UNIT);
    energy.createDefaultIdentifyClusterServer();
    energy.createDefaultBasicInformationClusterServer('Eve energy', '0x88528475', 4874, 'Eve Systems', 80, 'Eve Energy 20EBO8301', 6650, '3.2.1', 1, '1.1');
    energy.createDefaultScenesClusterServer();
    energy.createDefaultGroupsClusterServer();
    energy.createDefaultOnOffClusterServer(true);
    energy.createDefaultElectricalMeasurementClusterServer();
    energy.createDefaultPowerSourceWiredClusterServer();
    energy.createEnergyEveHistoryClusterServer(history, this.log);
    history.autoPilot(energy);

    await this.registerDevice(energy);

    energy.addCommandHandler('identify', async ({ request: { identifyTime } }) => {
      this.log.warn(`Command identify called identifyTime:${identifyTime}`);
      logEndpoint(energy);
      history.logHistory(false);
    });

    setInterval(
      () => {
        let state = energy.getClusterServerById(OnOff.Cluster.id)?.getOnOffAttribute();
        state = !state;
        const voltage = history.getFakeLevel(210, 235, 2);
        const current = state === true ? history.getFakeLevel(0.05, 10.5, 2) : 0;
        const power = state === true ? history.getFakeLevel(0.5, 1550, 2) : 0;
        const consumption = history.getFakeLevel(0.5, 1550, 2);
        energy?.getClusterServerById(OnOff.Cluster.id)?.setOnOffAttribute(state);
        energy?.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setRmsVoltageAttribute(voltage);
        energy?.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setRmsCurrentAttribute(current);
        energy?.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setActivePowerAttribute(power);
        energy?.getClusterServerById(ElectricalMeasurement.Cluster.id)?.setTotalActivePowerAttribute(consumption);
        energy?.getClusterServerById(EveHistory.Cluster.id)?.setVoltageAttribute(voltage);
        energy?.getClusterServerById(EveHistory.Cluster.id)?.setCurrentAttribute(current);
        energy?.getClusterServerById(EveHistory.Cluster.id)?.setConsumptionAttribute(power);
        history.setLastEvent();
        history.addEntry({ time: history.now(), status: state === true ? 1 : 0, voltage, current, power, consumption });
        this.log.info(`Set state to ${state} voltage:${voltage} current:${current} power:${power} consumption:${consumption}`);
      },
      60 * 1000 - 200,
    );
  }

  override async onShutdown(reason?: string) {
    this.log.info('onShutdown called with reason:', reason ?? 'none');
  }
}
