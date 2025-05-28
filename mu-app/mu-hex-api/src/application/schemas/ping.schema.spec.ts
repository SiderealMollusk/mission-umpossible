import { PingCommandSchema } from './ping.schema';
import { z } from 'zod';

describe('PingCommandSchema', () => {
  it('accepts only the required version field', () => {
    const result = PingCommandSchema.safeParse({ version: 1 });
    expect(result.success).toBe(true);
  });

  it('accepts optional echo and clientId fields', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const result = PingCommandSchema.safeParse({
      version: 1,
      echo: 'test echo',
      clientId: uuid,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing version', () => {
    const result = PingCommandSchema.safeParse({ echo: 'no version' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('version'))).toBe(true);
    }
  });

  it('rejects extra keys', () => {
    const result = PingCommandSchema.safeParse({ version: 1, unexpected: true });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(issue => issue.code === z.ZodIssueCode.unrecognized_keys)
      ).toBe(true);
    }
  });
});
