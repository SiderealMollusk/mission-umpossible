// src/core/useCaseBase.spec.ts
import { UseCaseBase } from './useCaseBase'
import { ILogger } from '../application/ports/ILogger'

class DummyUseCase extends UseCaseBase<{ foo: number }, string> {
  // record whether run was called
  public ran = false

  protected async run(cmd: { foo: number }): Promise<string> {
    this.ran = true
    if (cmd.foo < 0) throw new Error('neg')
    return `got:${cmd.foo}`
  }
}

describe('UseCaseBase', () => {
  let logs: Array<{ level: string; meta: any; msg: string }>
  let logger: ILogger
  let uc: DummyUseCase

  beforeEach(() => {
    logs = []
    logger = {
      info: (meta, message) => logs.push({ level: 'info', meta, msg: message }),
      warn: (meta, message) => logs.push({ level: 'warn', meta, msg: message }),
      error: (meta, message) => logs.push({ level: 'error', meta, msg: message }),
      debug: (meta, message) => logs.push({ level: 'debug', meta, msg: message }),
    }
    uc = new DummyUseCase(logger)
  })

  it('logs start and finish on success', async () => {
    const result = await uc.execute({ foo: 42 })
    expect(result).toBe('got:42')
    expect(uc.ran).toBe(true)
    expect(logs.map(l => l.level)).toEqual(['info', 'info'])
    expect(logs[0].msg).toMatch(/Start use-case/)
    expect(logs[1].msg).toMatch(/Finish use-case/)
  })

  it('logs error and rethrows on failure', async () => {
    await expect(uc.execute({ foo: -1 })).rejects.toThrow('neg')
    expect(uc.ran).toBe(true)
    expect(logs.map(l => l.level)).toEqual(['info', 'error'])
    expect(logs[1].msg).toMatch(/Use-case failed/)
    // the error object should be in meta.err
    expect(logs[1].meta.err).toBeInstanceOf(Error)
  })
})