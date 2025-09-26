import { IModule, IModuleConfig, ModuleStatus } from '../../core/interfaces/IModule.js';
import { AssignmentService } from './AssignmentService.js';
import { AssignmentController } from './AssignmentController.js';
import { assignmentRoutes } from './AssignmentRouter.js';
import { Router } from 'express';

export class AssignmentModule implements IModule {
  public readonly config: IModuleConfig;
  public readonly service: AssignmentService;
  public readonly controller: AssignmentController;
  private moduleStatus: ModuleStatus = ModuleStatus.UNINITIALIZED;

  constructor(config: IModuleConfig) {
    this.config = config;
    this.service = new AssignmentService();
    this.controller = new AssignmentController(this.service);
  }

  async initialize(): Promise<void> {
    try {
      await this.service.initialize();
      this.moduleStatus = ModuleStatus.READY;
      console.log(`✅ ${this.config.name} module initialized successfully`);
    } catch (error) {
      this.moduleStatus = ModuleStatus.ERROR;
      console.error(`❌ Error initializing ${this.config.name} module:`, error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.service.cleanup();
      this.moduleStatus = ModuleStatus.DISABLED;
      console.log(`🧹 ${this.config.name} module cleaned up successfully`);
    } catch (error) {
      console.error(`❌ Error cleaning up ${this.config.name} module:`, error);
      throw error;
    }
  }

  getRouter(): Router {
    return assignmentRoutes(this.controller);
  }

  isReady(): boolean {
    return this.moduleStatus === ModuleStatus.READY;
  }

  getStatus(): ModuleStatus {
    return this.moduleStatus;
  }

  async enable(): Promise<void> {
    if (this.moduleStatus === ModuleStatus.DISABLED) {
      await this.initialize();
    }
  }

  async disable(): Promise<void> {
    if (this.moduleStatus === ModuleStatus.READY) {
      await this.cleanup();
    }
  }
}