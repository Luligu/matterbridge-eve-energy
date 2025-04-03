/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Matterbridge, MatterbridgeEndpoint, PlatformConfig } from 'matterbridge';
import { Identify } from 'matterbridge/matter/clusters';
import { AnsiLogger } from 'matterbridge/logger';
import { EveEnergyPlatform } from './platform';
import { jest } from '@jest/globals';

describe('TestPlatform', () => {
  let testPlatform: EveEnergyPlatform;

  // Spy on and mock AnsiLogger.log
  const loggerLogSpy = jest.spyOn(AnsiLogger.prototype, 'log').mockImplementation((level: string, message: string, ...parameters: any[]) => {
    //
  });

  const mockLog = {
    fatal: jest.fn((message: string, ...parameters: any[]) => {
      // console.log('mockLog.fatal', message, parameters);
    }),
    error: jest.fn((message: string, ...parameters: any[]) => {
      // console.log('mockLog.error', message, parameters);
    }),
    warn: jest.fn((message: string, ...parameters: any[]) => {
      // console.log('mockLog.warn', message, parameters);
    }),
    notice: jest.fn((message: string, ...parameters: any[]) => {
      // console.log('mockLog.notice', message, parameters);
    }),
    info: jest.fn((message: string, ...parameters: any[]) => {
      // console.log('mockLog.info', message, parameters);
    }),
    debug: jest.fn((message: string, ...parameters: any[]) => {
      // console.log('mockLog.debug', message, parameters);
    }),
  } as unknown as AnsiLogger;

  const mockMatterbridge = {
    matterbridgeDirectory: './jest/matterbridge',
    matterbridgePluginDirectory: './jest/plugins',
    systemInformation: { ipv4Address: undefined, ipv6Address: undefined, osRelease: 'xx.xx.xx.xx.xx.xx', nodeVersion: '22.1.10' },
    matterbridgeVersion: '2.2.6',
    edge: true,
    log: mockLog,
    getDevices: jest.fn(() => {
      // console.log('getDevices called');
      return [];
    }),
    getPlugins: jest.fn(() => {
      // console.log('getDevices called');
      return [];
    }),
    addBridgedEndpoint: jest.fn(async (pluginName: string, device: MatterbridgeEndpoint) => {
      // console.log('addBridgedEndpoint called');
    }),
    removeBridgedEndpoint: jest.fn(async (pluginName: string, device: MatterbridgeEndpoint) => {
      // console.log('removeBridgedEndpoint called');
    }),
    removeAllBridgedEndpoints: jest.fn(async (pluginName: string) => {
      // console.log('removeAllBridgedEndpoints called');
    }),
  } as unknown as Matterbridge;

  const mockConfig = {
    'name': 'matterbridge-eve-energy',
    'type': 'AccessoryPlatform',
    'unregisterOnShutdown': false,
    'debug': false,
  } as PlatformConfig;

  testPlatform = new EveEnergyPlatform(mockMatterbridge, mockLog, mockConfig);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not initialize platform with wrong version', () => {
    mockMatterbridge.matterbridgeVersion = '1.5.0';
    expect(() => (testPlatform = new EveEnergyPlatform(mockMatterbridge, mockLog, mockConfig))).toThrow();
    mockMatterbridge.matterbridgeVersion = '2.2.6';
  });

  it('should initialize platform with config name', () => {
    testPlatform = new EveEnergyPlatform(mockMatterbridge, mockLog, mockConfig);
    expect(mockLog.info).toHaveBeenCalledWith('Initializing platform:', mockConfig.name);
  });

  it('should call onStart with reason', async () => {
    await testPlatform.onStart('Test reason');
    expect(mockLog.info).toHaveBeenCalledWith('onStart called with reason:', 'Test reason');
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(Object.keys(testPlatform.energy.behaviors.supported)).toHaveLength(7); // ["descriptor", "matterbridge", "identify", "groups", "onOff", "powerSource", "eveHistory"]
  });

  it('should call onConfigure', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(Object.keys(testPlatform.energy.behaviors.supported)).toHaveLength(7); // ["descriptor", "matterbridge", "identify", "groups", "onOff", "powerSource", "eveHistory"]

    jest.useFakeTimers();

    await testPlatform.onConfigure();
    expect(mockLog.info).toHaveBeenCalledWith('onConfigure called');

    for (let i = 0; i < 100; i++) jest.advanceTimersByTime(61 * 1000);

    expect(mockLog.info).toHaveBeenCalledTimes(103);
    expect(mockLog.error).toHaveBeenCalledTimes(102);

    jest.useRealTimers();
  });

  it('should execute the commandHandlers', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(Object.keys(testPlatform.energy.behaviors.supported)).toHaveLength(7); // ["descriptor", "matterbridge", "identify", "groups", "onOff", "powerSource", "eveHistory"]
    await testPlatform.energy.executeCommandHandler('identify', { identifyTime: 5 });
    await testPlatform.energy.executeCommandHandler('triggerEffect', { effectIdentifier: Identify.EffectIdentifier.Blink, effectVariant: Identify.EffectVariant.Default });
  });

  it('should call onShutdown with reason', async () => {
    await testPlatform.onShutdown('Test reason');
    expect(mockLog.info).toHaveBeenCalledWith('onShutdown called with reason:', 'Test reason');
  });
});
