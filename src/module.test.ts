const MATTER_PORT = 6000;
const NAME = 'Platform';
const HOMEDIR = path.join('jest', NAME);

import path from 'node:path';

import { PlatformConfig } from 'matterbridge';
import { Identify } from 'matterbridge/matter/clusters';
import { LogLevel } from 'matterbridge/logger';
import { jest } from '@jest/globals';
import {
  addMatterbridgePlatform,
  createMatterbridgeEnvironment,
  destroyMatterbridgeEnvironment,
  log,
  loggerLogSpy,
  matterbridge,
  setupTest,
  startMatterbridgeEnvironment,
  stopMatterbridgeEnvironment,
} from 'matterbridge/jestutils';

import initializePlugin, { EveEnergyPlatform } from './module.js';

// Setup the test environment
setupTest(NAME, false);

describe('TestPlatform', () => {
  let testPlatform: EveEnergyPlatform;

  const config: PlatformConfig = {
    name: 'matterbridge-eve-energy',
    type: 'AccessoryPlatform',
    version: '1.0.0',
    unregisterOnShutdown: false,
    debug: false,
  };

  beforeAll(async () => {
    await createMatterbridgeEnvironment(NAME);
    await startMatterbridgeEnvironment(MATTER_PORT);
  });

  beforeEach(() => {
    // Reset the mock calls before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await stopMatterbridgeEnvironment();
    await destroyMatterbridgeEnvironment();
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
    matterbridge.matterbridgeVersion = '3.5.0';
  });

  it('should initialize platform with config name', () => {
    testPlatform = new EveEnergyPlatform(matterbridge, log, config);
    addMatterbridgePlatform(testPlatform);
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'Initializing platform:', config.name);
  });

  it('should call onStart with reason', async () => {
    await testPlatform.onStart('Test reason');
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'onStart called with reason:', 'Test reason');
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(testPlatform.energy.getAllClusterServerNames()).toEqual(['descriptor', 'matterbridge', 'identify', 'groups', 'scenesManagement', 'onOff', 'powerSource', 'eveHistory']);
  });

  it('should call onConfigure', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;

    jest.useFakeTimers();

    await testPlatform.onConfigure();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, 'onConfigure called');

    for (let i = 0; i < 20; i++) {
      await jest.advanceTimersByTimeAsync(61 * 1000);
    }

    jest.useRealTimers();

    expect(loggerLogSpy).toHaveBeenCalled();
    expect(loggerLogSpy).not.toHaveBeenCalledWith(LogLevel.ERROR, expect.anything());
    // We cannot check that the state was set multiple times because of transactions
    // expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, expect.stringContaining('Set state to true'));
    // expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, expect.stringContaining('Set state to false'));
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
