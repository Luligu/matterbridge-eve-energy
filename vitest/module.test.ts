/**
 * @file vitest/module.test.ts
 * @description This file contains the tests for the EveEnergyPlatform.
 * @author Luca Liguori
 */

const NAME = 'Platform';
const MATTER_PORT = 6000;
const MATTER_CREATE_ONLY = true;

import type { PlatformConfig, PlatformMatterbridge } from 'matterbridge';
import { LogLevel } from 'matterbridge/logger';
import { Identify } from 'matterbridge/matter/clusters';
import {
  addMatterbridge,
  createServerNode,
  createTestEnvironment,
  destroyTestEnvironment,
  flushServerNode,
  getMatterbridge,
  log,
  loggerLogSpy,
  setupTest,
  startServerNode,
  stopServerNode,
} from 'matterbridge/test-utils/vitest';

import initializePlugin, { EveEnergyPlatform } from '../src/module.js';

// Setup the test environment
await setupTest(NAME, false);

describe('TestPlatform', () => {
  let matterbridge: PlatformMatterbridge;
  let testPlatform: EveEnergyPlatform;

  const config: PlatformConfig = {
    name: 'matterbridge-eve-energy',
    type: 'AccessoryPlatform',
    version: '1.0.0',
    unregisterOnShutdown: false,
    debug: false,
  };

  beforeAll(async () => {
    // Create the Matter test environment
    await createTestEnvironment();
    await createServerNode(MATTER_PORT);
    if (!MATTER_CREATE_ONLY) await startServerNode();
    matterbridge = getMatterbridge();
  });

  beforeEach(() => {
    // Reset the mock calls before each test
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Destroy the Matter test environment
    if (MATTER_CREATE_ONLY) await flushServerNode();
    else await stopServerNode();
    await destroyTestEnvironment();
    // Restore all mocks
    vi.restoreAllMocks();
  });

  it('should return an instance of Platform', async () => {
    const platform = initializePlugin(matterbridge, log, config);
    expect(platform).toBeInstanceOf(EveEnergyPlatform);
    await platform.onShutdown();
  });

  it('should not initialize platform with wrong version', () => {
    expect(() => (testPlatform = new EveEnergyPlatform({ ...matterbridge, matterbridgeVersion: '3.8.0' }, log, config))).toThrow(
      'This plugin requires Matterbridge version >= "3.10.10".',
    );
  });

  it('should initialize platform with config name', () => {
    testPlatform = new EveEnergyPlatform(matterbridge, log, config);
    addMatterbridge(testPlatform);
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Initializing platform ${config.name}...`);
  });

  it('should call onStart with reason', async () => {
    await testPlatform.onStart('Test reason');
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Starting platform ${config.name} with reason: Test reason...`);
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(testPlatform.energy.getAllClusterServerNames()).toEqual(['descriptor', 'matterbridge', 'identify', 'groups', 'scenesManagement', 'onOff', 'powerSource', 'eveHistory']);
  });

  it('should call onConfigure', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;

    vi.useFakeTimers();

    await testPlatform.onConfigure();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Configuring platform ${config.name}...`);

    for (let i = 0; i < 20; i++) {
      await vi.advanceTimersByTimeAsync(61 * 1000);
    }

    vi.useRealTimers();

    expect(loggerLogSpy).toHaveBeenCalled();
    expect(loggerLogSpy).not.toHaveBeenCalledWith(LogLevel.ERROR, expect.anything());
    // We cannot check that the state was set multiple times because of transactions
    // expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, expect.stringContaining('Set state to true'));
    // expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, expect.stringContaining('Set state to false'));
  });

  it('should execute the commandHandlers', async () => {
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    await testPlatform.energy.executeCommandHandler('identify', { identifyTime: 5 }, 'identify', {} as any, testPlatform.energy);
    await testPlatform.energy.executeCommandHandler(
      'triggerEffect',
      { effectIdentifier: Identify.EffectIdentifier.Blink, effectVariant: Identify.EffectVariant.Default },
      'identify',
      {} as any,
      testPlatform.energy,
    );
  });

  it('should call onShutdown with reason', async () => {
    testPlatform.config.unregisterOnShutdown = true;
    await testPlatform.onShutdown('Test reason');
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Shutting down platform ${config.name} with reason: Test reason...`);
  });

  it('should call onStart in bridge mode', async () => {
    (testPlatform.matterbridge as any).bridgeMode = 'bridge';
    await testPlatform.onStart();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Starting platform ${config.name} with reason: no reason provided...`);
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(testPlatform.energy.getAllClusterServerNames()).toEqual(['descriptor', 'matterbridge', 'identify', 'groups', 'scenesManagement', 'onOff', 'powerSource', 'eveHistory']);

    testPlatform.config.unregisterOnShutdown = true;
    await testPlatform.onShutdown();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Shutting down platform ${config.name} with reason: no reason provided...`);
  });

  it('should call onStart in childbridge mode', async () => {
    (testPlatform.matterbridge as any).bridgeMode = 'childbridge';
    await testPlatform.onStart();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Starting platform ${config.name} with reason: no reason provided...`);
    expect(testPlatform.energy).toBeDefined();
    if (!testPlatform.energy) return;
    expect(testPlatform.energy.getAllClusterServerNames()).toEqual(['descriptor', 'matterbridge', 'identify', 'groups', 'scenesManagement', 'onOff', 'powerSource', 'eveHistory']);

    testPlatform.config.unregisterOnShutdown = true;
    await testPlatform.onShutdown();
    expect(loggerLogSpy).toHaveBeenCalledWith(LogLevel.INFO, `Shutting down platform ${config.name} with reason: no reason provided...`);
  });
});
