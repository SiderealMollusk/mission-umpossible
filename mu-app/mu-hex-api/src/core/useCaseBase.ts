import { ILogger } from '../application/ports/ILogger'

export abstract class UseCaseBase<TCmd, TResult> {
  protected logger: ILogger

  constructor(logger: ILogger) {
    this.logger = logger
  }

  async execute(cmd: TCmd): Promise<TResult> {
    const useCaseName = this.constructor.name
    this.logger.info({ useCase: useCaseName, cmd }, 'Start use-case')
    try {
      const result = await this.run(cmd)
      this.logger.info({ useCase: useCaseName, result }, 'Finish use-case')
      return result
    } catch (err: any) {
      this.logger.error({ useCase: useCaseName, err }, 'Use-case failed')
      throw err
    }
  }

  protected abstract run(cmd: TCmd): Promise<TResult>
}