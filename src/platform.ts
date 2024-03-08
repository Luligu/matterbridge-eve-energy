import { DeviceTypes, logEndpoint, BooleanState } from 'matterbridge';

import { Matterbridge, MatterbridgeDevice, MatterbridgeAccessoryPlatform, MatterHistory } from 'matterbridge';
import { AnsiLogger } from 'node-ansi-logger';

export class EveDoorPlatform extends MatterbridgeAccessoryPlatform {
  constructor(matterbridge: Matterbridge, log: AnsiLogger) {
    super(matterbridge, log);
  }

  override async onStart(reason?: string) {
    this.log.info('onStart called with reason:', reason ?? 'none');

    const history = new MatterHistory(this.log, 'Eve door', { filePath: this.matterbridge.matterbridgeDirectory });

    const door = new MatterbridgeDevice(DeviceTypes.CONTACT_SENSOR);
    door.createDefaultIdentifyClusterServer();
    door.createDefaultBasicInformationClusterServer('Eve door', '0x88030475', 4874, 'Eve Systems', 77, 'Eve Door 20EBN9901', 1144, '1.2.8');
    door.createDefaultPowerSourceReplaceableBatteryClusterServer(75);
    door.createDefaultBooleanStateClusterServer(true);
    door.createDoorEveHistoryClusterServer(history, this.log);
    history.autoPilot(door);

    await this.registerDevice(door);

    door.addCommandHandler('identify', async ({ request: { identifyTime } }) => {
      this.log.warn(`Command identify called identifyTime:${identifyTime}`);
      logEndpoint(door);
      history.logHistory(false);
    });

    setInterval(
      () => {
        let contact = door.getClusterServerById(BooleanState.Cluster.id)?.getStateValueAttribute();
        contact = !contact;
        door.getClusterServerById(BooleanState.Cluster.id)?.setStateValueAttribute(contact);
        door.getClusterServerById(BooleanState.Cluster.id)?.triggerStateChangeEvent({ stateValue: contact });
        if (contact === false) history.addToTimesOpened();
        history.setLastEvent();
        history.addEntry({ time: history.now(), contact: contact === true ? 0 : 1 });
        this.log.info(`Set contact to ${contact}`);
      },
      60 * 1000 - 500,
    );
  }

  override async onShutdown(reason?: string) {
    this.log.info('onShutdown called with reason:', reason ?? 'none');
  }
}
