import { MatterHistory } from 'matter-history';
import { PlatformConfig, Matterbridge, MatterbridgeAccessoryPlatform, powerSource, MatterbridgeEndpoint, onOffOutlet } from 'matterbridge';
import { OnOff } from 'matterbridge/matter/clusters';
import { AnsiLogger } from 'matterbridge/logger';

export class EveEnergyPlatform extends MatterbridgeAccessoryPlatform {
  energy: MatterbridgeEndpoint | undefined;
  history: MatterHistory | undefined;
  interval: NodeJS.Timeout | undefined;

  constructor(matterbridge: Matterbridge, log: AnsiLogger, config: PlatformConfig) {
    super(matterbridge, log, config);

    // Verify that Matterbridge is the correct version
    if (this.verifyMatterbridgeVersion === undefined || typeof this.verifyMatterbridgeVersion !== 'function' || !this.verifyMatterbridgeVersion('3.0.0')) {
      throw new Error(
        `This plugin requires Matterbridge version >= "3.0.0". Please update Matterbridge from ${this.matterbridge.matterbridgeVersion} to the latest version in the frontend."`,
      );
    }

    this.log.info('Initializing platform:', this.config.name);
  }

  override async onStart(reason?: string) {
    this.log.info('onStart called with reason:', reason ?? 'none');

    this.history = new MatterHistory(this.log, 'Eve energy', { filePath: this.matterbridge.matterbridgeDirectory });

    this.energy = new MatterbridgeEndpoint([onOffOutlet, powerSource], { uniqueStorageKey: 'Eve energy' }, this.config.debug as boolean);
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
      () => {
        if (!this.energy || !this.history) return;
        let state = this.energy.getAttribute(OnOff.Cluster.id, 'onOff', this.log) as boolean;
        state = !state;
        const voltage = this.history.getFakeLevel(210, 235, 2);
        const current = state === true ? this.history.getFakeLevel(0.05, 10.5, 2) : 0;
        const power = state === true ? this.history.getFakeLevel(0.5, 1550, 2) : 0;
        const consumption = this.history.getFakeLevel(0.5, 1550, 2);
        this.energy.setAttribute(OnOff.Cluster.id, 'onOff', state, this.log);
        /*
        this.energy.setAttribute(EveHistory.Cluster.id, 'Voltage', voltage, this.log);
        this.energy.setAttribute(EveHistory.Cluster.id, 'Current', current, this.log);
        this.energy.setAttribute(EveHistory.Cluster.id, 'Consumption', power, this.log);
        this.energy.setAttribute(EveHistory.Cluster.id, 'TotalConsumption', consumption, this.log);
        */
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
    if (this.config.unregisterOnShutdown === true) await this.unregisterAllDevices();
  }
}
