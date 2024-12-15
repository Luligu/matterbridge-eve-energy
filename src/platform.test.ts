/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClusterServerObj, Identify, Matterbridge, PlatformConfig } from 'matterbridge';
import { AnsiLogger } from 'matterbridge/logger';
import { EveEnergyPlatform } from './platform';
import { jest } from '@jest/globals';

describe('TestPlatform', () => {
  let testPlatform: EveEnergyPlatform;

  async function invokeCommands(cluster: ClusterServerObj, data?: Record<string, boolean | number | bigint | string | object | null | undefined>): Promise<void> {
    const commands = (cluster as any).commands as object;
    for (const [key, value] of Object.entries(commands)) {
      if (typeof value.handler === 'function') await value.handler(data ?? {});
    }
  }

  async function invokeCommand(cluster: ClusterServerObj, command: string, data?: Record<string, boolean | number | bigint | string | object | null | undefined>): Promise<void> {
    const commands = (cluster as any).commands as object;
    for (const [key, value] of Object.entries(commands)) {
      if (key === command && typeof value.handler === 'function') await value.handler(data ?? {});
    }
  }

  const mockMatterbridge = {
    addBridgedDevice: jest.fn(),
    matterbridgeDirectory: '',
    matterbridgePluginDirectory: 'temp',
    systemInformation: { ipv4Address: undefined },
    matterbridgeVersion: '1.6.6',
    removeAllBridgedDevices: jest.fn(),
  } as unknown as Matterbridge;

  const mockLog = {
    fatal: jest.fn((message: string, ...parameters: any[]) => {
      // console.error('mockLog.fatal', message, parameters);
    }),
    error: jest.fn((message: string, ...parameters: any[]) => {
      // console.error('mockLog.error', message, parameters);
    }),
    warn: jest.fn((message: string, ...parameters: any[]) => {
      // console.error('mockLog.warn', message, parameters);
    }),
    notice: jest.fn((message: string, ...parameters: any[]) => {
      // console.error('mockLog.notice', message, parameters);
    }),
    info: jest.fn((message: string, ...parameters: any[]) => {
      // console.error('mockLog.info', message, parameters);
    }),
    debug: jest.fn((message: string, ...parameters: any[]) => {
      // console.error('mockLog.debug', message, parameters);
    }),
  } as unknown as AnsiLogger;

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
    mockMatterbridge.matterbridgeVersion = '1.6.6';
  });

  it('should initialize platform with config name', () => {
    mockConfig.noDevices = true;
    mockConfig.delayStart = true;
    testPlatform = new EveEnergyPlatform(mockMatterbridge, mockLog, mockConfig);
    expect(mockLog.info).toHaveBeenCalledWith('Initializing platform:', mockConfig.name);
  });

  it('should call onStart with reason', async () => {
    await testPlatform.onStart('Test reason');
    expect(mockLog.info).toHaveBeenCalledWith('onStart called with reason:', 'Test reason');
    expect(testPlatform.energy).toBeDefined();
    expect(testPlatform.energy?.getAllClusterServers()).toHaveLength(8);
  });

  it('should call onConfigure', async () => {
    jest.useFakeTimers();

    await testPlatform.onConfigure();
    expect(mockLog.info).toHaveBeenCalledWith('onConfigure called');
    expect(testPlatform.energy).toBeDefined();
    expect(testPlatform.energy?.getAllClusterServers()).toHaveLength(8);

    for (let i = 0; i < 100; i++) jest.advanceTimersByTime(61 * 1000);

    expect(mockLog.info).toHaveBeenCalledTimes(715);

    jest.useRealTimers();
  });

  it('should execute the commandHandlers', async () => {
    expect(testPlatform.energy).toBeDefined();
    expect(testPlatform.energy?.getAllClusterServers()).toHaveLength(8);
    const identify = testPlatform.energy?.getClusterServerById(Identify.Cluster.id);
    expect(identify).toBeDefined();
    await invokeCommands(identify as ClusterServerObj);
  });

  it('should call onShutdown with reason', async () => {
    await testPlatform.onShutdown('Test reason');
    expect(mockLog.info).toHaveBeenCalledWith('onShutdown called with reason:', 'Test reason');
  });
});
