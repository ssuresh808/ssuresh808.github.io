import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z, type ZodType } from 'zod';
import { ProfileSchema, type Profile } from './schemas/profile';
import { ExperienceFileSchema, type ExperienceEntry } from './schemas/experience';
import { EducationFileSchema, type EducationFile } from './schemas/education';
import { SkillsFileSchema, type SkillGroup } from './schemas/skills';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

export class ContentError extends Error {
  constructor(
    public readonly filePath: string,
    detail: string,
  ) {
    super(`${filePath}\n${detail}`);
    this.name = 'ContentError';
  }
}

export function readYamlFile<T>(filePath: string, schema: ZodType<T>): T {
  if (!fs.existsSync(filePath)) throw new ContentError(filePath, 'file not found');
  let parsed: unknown;
  try {
    parsed = parseYaml(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    throw new ContentError(filePath, `YAML parse error: ${(e as Error).message}`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) throw new ContentError(filePath, z.prettifyError(result.error));
  return result.data;
}

export function loadProfile(dir: string = CONTENT_DIR): Profile {
  return readYamlFile(path.join(dir, 'profile.yaml'), ProfileSchema);
}
export function loadExperience(dir: string = CONTENT_DIR): ExperienceEntry[] {
  return readYamlFile(path.join(dir, 'experience.yaml'), ExperienceFileSchema);
}
export function loadEducation(dir: string = CONTENT_DIR): EducationFile {
  return readYamlFile(path.join(dir, 'education.yaml'), EducationFileSchema);
}
export function loadSkills(dir: string = CONTENT_DIR): SkillGroup[] {
  return readYamlFile(path.join(dir, 'skills.yaml'), SkillsFileSchema);
}
