import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getMetadata } from '@/lib/get-metadata';
import { compileMarkdownString } from '@/lib/markdown';
import { getFormattedDate } from '@/lib/utils';
import LegalPage from '@/components/pages/legal/legal-page';

const TITLE = 'All Things Open Giveaway: Official Rules';
const DESCRIPTION =
  'Official rules for the All Things Open giveaway. No purchase necessary. Entries open October 19, 2026 and close October 23, 2026.';
const UPDATED_AT = '2026-10-15T12:00:00.000Z';
const RULES_PATH = path.join(process.cwd(), 'src/content/giveaway/official-rules.md');

export const metadata = getMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: '/all-things-open/rules',
});

export default async function AllThingsOpenRulesPage() {
  const source = await readFile(RULES_PATH, 'utf8');
  const content = await compileMarkdownString(source);

  return (
    <LegalPage
      title={TITLE}
      updatedAt={UPDATED_AT}
      formattedDate={getFormattedDate(UPDATED_AT, 'long')}
      content={content}
      tableOfContents={[]}
    />
  );
}
