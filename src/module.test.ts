const MATTER_PORT = 6000;
const NAME = 'Platform';
const HOMEDIR = path.join('jest', NAME);

import path from 'node:path';

import { Matterbridge, MatterbridgeEndpoint, PlatformConfig } from 'matterbridge';
import { Identify } from 'matterbridge/matter/clusters';
import { AnsiLogger, LogLevel, TimestampFormat } from 'matterbridge/logger';
import { jest } from '@jest/globals';
import { AggregatorEndpoint } from 'matterbridge/matter/endpoints';
import { Endpoint, ServerNode } from 'matterbridge/matter';

import initializePlugin, { EveEnergyPlatform } from './module.js';
import {
  createMatterbridgeEnvironment,
  destroyMatterbridgeEnvironment,
  loggerLogSpy,
  setDebug,
  setupTest,
  startMatterbridgeEnvironment,
  stopMatterbridgeEnvironment,
} from './jestHelpers.js';

// Setup the test environment
setupTest(NAME, false);

describe('TestPlatform', () => {
  let matterbridge: Matterbridge;
  let server: ServerNode<ServerNode.RootEndpoint>;
  let aggregator: Endpoint<AggregatorEndpoint>;
  let testPlatform: EveEnergyPlatform;
  let log: AnsiLogger;

  const config = {
    name: 'matterbridge-eve-energy',
    type: 'AccessoryPlatform',
    unregisterOnShutdown: false,
    debug: false,
  } as PlatformConfig;

  beforeAll(async () => {
    matterbridge = await createMatterbridgeEnvironment(NAME);
    [server, aggregator] = await startMatterbridgeEnvironment(matterbridge, MATTER_PORT);
    log = new AnsiLogger({ logName: NAME, logTimestampFormat: TimestampFormat.TIME_MILLIS, logLevel: LogLevel.DEBUG });
  });

  beforeEach(() => {
    // Reset the mock calls before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await stopMatterbridgeEnvironment(matterbridge, server, aggregator);
    await destroyMatterbridgeEnvironment(matterbridge);
    // Restore all mocks
    jest.restoreAllMocks();
  });

  it('should return an instance of Platform', async () => {
    const platform = initializePlugin(matterbridge, log, config);
    expect(platform).toBeInstanceOf(EveEnergyPlatform);
    await platform.onShutdown();
  });

  it('should not initialize platform with wrong version', () => {
    matterbridge.matterbridgeVersion = '1.5.0';
    expect(() => (testPlatform = new EveEnergyPlatform(matterbridge, log, config))).toThrow();
    matterbridge.matterbridgeVersion = '3.3.0';
  });

  it('should initialize platform with config name', () => {
    // @ts-expect-error accessing private member for testing
    matterbridge.plugins._plugins.set('matterbridge-jest', {});
    testPlatform = new EveEnergyPlatform(matterbridge, log, config);
    testPlatform['name'] = 'matterbridge-jest';
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'Initializing platform:', config.name);
  });

  it('should call onStart with reason', async () => {
    await testPlatform.onStart('Test reason');
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'onStart called with reason:', 'Test reason');
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(testPlatform.energy.getAllClusterServerNames()).toEqual(['descriptor', 'matterbridge', 'identify', 'groups', 'onOff', 'powerSource', 'eveHistory']);
  });

  it('should call onConfigure', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;

    setDebug(true);
    jest.useFakeTimers();

    await testPlatform.onConfigure();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'onConfigure called');

    for (let i = 0; i < 20; i++) {
      await jest.advanceTimersByTimeAsync(61 * 1000);
    }

    jest.useRealTimers();
    setDebug(false);

    expect(loggerLogSpy).toHaveBeenCalled();
    expect(loggerLogSpy).not.toHaveBeenCalledWith(LogLevel.ERROR, expect.anything());
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, expect.stringContaining('Set state to true'));
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, expect.stringContaining('Set state to false'));
  });

  it('should execute the commandHandlers', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    await testPlatform.energy.executeCommandHandler('identify', { identifyTime: 5 });
    await testPlatform.energy.executeCommandHandler('triggerEffect', { effectIdentifier: Identify.EffectIdentifier.Blink, effectVariant: Identify.EffectVariant.Default });
  });

  it('should call onShutdown with reason', async () => {
    await testPlatform.onShutdown('Test reason');
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'onShutdown called with reason:', 'Test reason');
  });
});
